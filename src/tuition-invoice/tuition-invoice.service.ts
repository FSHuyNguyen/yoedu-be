import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTuitionInvoiceDto } from './dto/create-tuition-invoice.dto';
import { UpdateTuitionInvoiceDto } from './dto/update-tuition-invoice.dto';
import { CourseClassService } from '../course-class/course-class.service';
import { StudentService } from '../student/student.service';
import { PrismaService } from '../prisma/prisma.service';
import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';
import {
  DiscountType,
  EnrollmentStatus,
  InvoiceStatus,
  Prisma,
} from '@prisma/client';
import { generateCode } from '../shared/utils/generate-code';
import type { AuthUser } from '../auth/types/auth-jwt-user.type';
import { TuitionInvoiceQueryDto } from './dto/query-tuition-invoice.dto';
import {
  mapTuitionInvoiceResponse,
  TUITION_INVOICE_INCLUDE,
} from './mappers/tuition-invoice.mapper';
import { EnrollmentService } from '../enrollment/enrollment.service';
import { PromotionService } from '../promotion/promotion.service';

@Injectable()
export class TuitionInvoiceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly studentService: StudentService,
    private readonly courseClassService: CourseClassService,
    private readonly enrollmentService: EnrollmentService,
    private readonly promotionService: PromotionService,
  ) {}

  async getInvoiceByIdOrThrow(id: string) {
    const invoice = await this.prismaService.tuitionInvoice.findUnique({
      where: {
        id,
      },
      include: TUITION_INVOICE_INCLUDE,
    });

    if (!invoice) {
      throw new NotFoundException('Không tìm thấy hóa đơn');
    }

    return invoice;
  }

  /* Lấy ra các hóa đơn cần thanh toán có trạng thái là UNPAID, PARTIAL */
  async getTuitionOptions() {
    const tuitions = await this.prismaService.tuitionInvoice.findMany({
      where: {
        status: {
          in: [InvoiceStatus.UNPAID, InvoiceStatus.PARTIAL],
        },
      },
      include: TUITION_INVOICE_INCLUDE,
    });

    return tuitions.map((tuition) => ({
      ...tuition,
      value: tuition.id,
      label: tuition.invoiceCode,
    }));
  }

  async create(dto: CreateTuitionInvoiceDto) {
    const { studentId, courseClassId, dueDate, note, promotionId } = dto;

    const [student, courseClass, enrollment] = await Promise.all([
      this.studentService.getStudentByIdOrThrow(studentId),
      this.courseClassService.getCourseClassByIdOrThrow(courseClassId),
      this.enrollmentService.getEnrollmentByStudentAndCourseClassOrThrow(
        studentId,
        courseClassId,
      ),
    ]);

    if (enrollment.status !== EnrollmentStatus.ACTIVE) {
      throw new BadRequestException(
        'Học viên chưa đăng ký khóa học hoặc đang bị tạm dừng',
      );
    }

    const existedInvoice = await this.prismaService.tuitionInvoice.findUnique({
      where: {
        studentId_courseClassId: {
          studentId,
          courseClassId,
        },
      },
    });

    if (existedInvoice) {
      throw new ConflictException('Hóa đơn đã tồn tại');
    }

    const originalAmount = Number(courseClass.tuitionFee);

    let discountAmount = 0;

    if (promotionId) {
      const promotion =
        await this.promotionService.getPromotionByIdOrThrow(promotionId);

      const value = Number(promotion.discountValue);

      if (promotion.discountType === DiscountType.AMOUNT) {
        discountAmount = value;
      } else {
        // PERCENT
        discountAmount = (originalAmount * value) / 100;
      }
    }

    if (discountAmount < 0) {
      throw new BadRequestException('Số tiền giảm giá không hợp lệ');
    }

    if (discountAmount > originalAmount) {
      throw new BadRequestException(
        'Số tiền giảm giá không được lớn hơn học phí',
      );
    }

    const finalAmount = originalAmount - discountAmount;

    await this.prismaService.tuitionInvoice.create({
      data: {
        invoiceCode: generateCode('INV'),

        studentId: student.id,
        courseClassId: courseClass.id,

        originalAmount,
        discountAmount,
        finalAmount,

        amountPaid: 0,
        balanceAmount: finalAmount,

        promotionId: promotionId ?? null,

        dueDate: dueDate ? new Date(dueDate) : null,
        note,
      },
    });

    return CustomResponse(
      true,
      StatusCode.CREATED,
      'Tạo hóa đơn thành công',
      null,
    );
  }

  async update(id: string, dto: UpdateTuitionInvoiceDto) {
    const invoice = await this.getInvoiceByIdOrThrow(id);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Không thể sửa hóa đơn đã thanh toán');
    }

    await this.prismaService.tuitionInvoice.update({
      where: {
        id,
      },
      data: {
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        note: dto.note,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Cập nhật hóa đơn thành công',
      null,
    );
  }

  async findAll(query: TuitionInvoiceQueryDto) {
    const {
      page = 1,
      limit = 10,
      status,
      studentId,
      courseClassId,
      promotionId,
      dueDateFrom,
      dueDateTo,
    } = query;

    const skip = (page - 1) * limit;

    const andConditions: Prisma.TuitionInvoiceWhereInput[] = [];

    if (studentId) {
      andConditions.push({
        studentId,
      });
    }

    if (courseClassId) {
      andConditions.push({
        courseClassId,
      });
    }

    if (promotionId) {
      andConditions.push({
        promotionId,
      });
    }

    if (dueDateFrom) {
      andConditions.push({
        dueDate: {
          gte: new Date(dueDateFrom),
        },
      });
    }

    if (dueDateTo) {
      andConditions.push({
        dueDate: {
          lte: new Date(dueDateTo),
        },
      });
    }

    if (status) {
      andConditions.push({
        status,
      });
    }

    const where: Prisma.TuitionInvoiceWhereInput =
      andConditions.length > 0
        ? {
            AND: andConditions,
          }
        : {};

    const [tuitionInvoices, total] = await Promise.all([
      this.prismaService.tuitionInvoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: TUITION_INVOICE_INCLUDE,
      }),

      this.prismaService.tuitionInvoice.count({ where }),
    ]);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy danh sách hóa đơn thành công',
      {
        items: tuitionInvoices.map(mapTuitionInvoiceResponse),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    );
  }

  async findById(id: string) {
    const invoice = await this.getInvoiceByIdOrThrow(id);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy hóa đơn thành công',
      mapTuitionInvoiceResponse(invoice),
    );
  }

  async remove(id: string) {
    const invoice = await this.getInvoiceByIdOrThrow(id);

    if (Number(invoice.amountPaid) > 0) {
      throw new BadRequestException(
        'Không thể xóa hóa đơn đã phát sinh thanh toán',
      );
    }

    await this.prismaService.tuitionInvoice.delete({
      where: {
        id,
      },
    });

    return CustomResponse(true, StatusCode.OK, 'Xóa hóa đơn thành công', null);
  }

  async findAllMe(currentUser: AuthUser, query: TuitionInvoiceQueryDto) {
    const {
      page = 1,
      limit = 10,
      status,
      courseClassId,
      promotionId,
      dueDateFrom,
      dueDateTo,
    } = query;

    const studentId = currentUser.studentId;

    if (!studentId) {
      throw new BadRequestException('Người dùng không phải là học sinh');
    }

    await this.studentService.getStudentByIdOrThrow(studentId);

    const skip = (page - 1) * limit;

    const andConditions: Prisma.TuitionInvoiceWhereInput[] = [
      {
        studentId,
      },
    ];

    if (courseClassId) {
      andConditions.push({
        courseClassId,
      });
    }

    if (promotionId) {
      andConditions.push({
        promotionId,
      });
    }

    if (dueDateFrom) {
      andConditions.push({
        dueDate: {
          gte: new Date(dueDateFrom),
        },
      });
    }

    if (dueDateTo) {
      andConditions.push({
        dueDate: {
          lte: new Date(dueDateTo),
        },
      });
    }

    if (status) {
      andConditions.push({
        status,
      });
    }

    const where: Prisma.TuitionInvoiceWhereInput =
      andConditions.length > 0
        ? {
            AND: andConditions,
          }
        : {};

    const [tuitionInvoices, total] = await Promise.all([
      this.prismaService.tuitionInvoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: TUITION_INVOICE_INCLUDE,
      }),

      this.prismaService.tuitionInvoice.count({ where }),
    ]);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy danh sách hóa đơn thành công',
      {
        items: tuitionInvoices.map(mapTuitionInvoiceResponse),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    );
  }

  async findMeInvoice(currentUser: AuthUser, id: string) {
    const studentId = currentUser.studentId;

    if (!studentId) {
      throw new BadRequestException('Người dùng không phải là học sinh');
    }

    await this.studentService.getStudentByIdOrThrow(studentId);

    const invoice = await this.getInvoiceByIdOrThrow(id);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy hóa đơn thành công',
      mapTuitionInvoiceResponse(invoice),
    );
  }
}

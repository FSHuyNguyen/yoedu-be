import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import {
  ActivityType,
  CourseStatus,
  EnrollmentStatus,
  Prisma,
  Role,
} from '@prisma/client';

import { StudentService } from '../student/student.service';
import { CourseService } from '../course/course.service';

import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EnrollmentQueryDto } from './dto/query-enrollment.dto';
import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';
import {
  ENROLLMENT_INCLUDE,
  mapEnrollmentResponse,
} from './mappers/enrollment.mapper';

@Injectable()
export class EnrollmentService {
  constructor(
    private readonly prismaService: PrismaService,

    private readonly studentService: StudentService,

    private readonly courseService: CourseService,
  ) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  async getEnrollmentByIdOrThrow(id: string) {
    const enrollment = await this.prismaService.enrollment.findUnique({
      where: {
        id,
      },
    });

    if (!enrollment) {
      throw new BadRequestException('Không tìm thấy đăng ký khóa học');
    }

    return enrollment;
  }

  async create(dto: CreateEnrollmentDto) {
    await this.studentService.getStudentByIdOrThrow(dto.studentId);

    const course = await this.courseService.getCourseByIdOrThrow(dto.courseId);

    if (course.status !== CourseStatus.OPEN) {
      throw new BadRequestException('Khóa học chưa mở đăng ký');
    }

    const currentStudents = await this.prismaService.enrollment.count({
      where: {
        courseId: dto.courseId,
        status: EnrollmentStatus.STUDYING,
      },
    });

    if (course.maxStudents && currentStudents >= course.maxStudents) {
      throw new BadRequestException('Khóa học đã đầy');
    }

    const existingEnrollment = await this.prismaService.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: dto.studentId,
          courseId: dto.courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('Học viên đã đăng ký khóa học này');
    }

    await this.prismaService.$transaction(async (tx) => {
      const enrollment = await tx.enrollment.create({
        data: {
          ...dto,
          originalPrice: course.price,
        },

        include: ENROLLMENT_INCLUDE,
      });

      await tx.activityLog.create({
        data: {
          type: ActivityType.STUDENT_ENROLLED,
          title: 'Đăng ký khóa học mới',
          description: `${enrollment.student.user.fullName} đã đăng ký khóa học ${enrollment.course.name}`,
        },
      });
    });

    return CustomResponse(
      true,
      StatusCode.CREATED,
      'Đăng ký khóa học thành công',
      null,
    );
  }

  async findAll(user: any, query: EnrollmentQueryDto) {
    const {
      page = 1,
      limit = 10,

      status,
      studentId,
      courseId,
      keySearch,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.EnrollmentWhereInput = {};

    // Admin -> xem tất cả
    // Teacher -> chỉ xem enrollment của course do mình dạy
    // Student -> chỉ xem enrollment của mình
    if (user.role === Role.TEACHER) {
      where.course = {
        teacherId: user.teacherId,
      };
    }

    if (user.role === Role.STUDENT) {
      where.studentId = user.studentId;
    }

    if (status) {
      where.status = status;
    }

    if (studentId) {
      where.studentId = studentId;
    }

    if (courseId) {
      where.courseId = courseId;
    }

    if (keySearch) {
      where.OR = [
        {
          student: {
            user: {
              fullName: {
                contains: keySearch,
                mode: 'insensitive',
              },
            },
          },
        },

        {
          course: {
            name: {
              contains: keySearch,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    const [enrollments, total] = await Promise.all([
      this.prismaService.enrollment.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        include: ENROLLMENT_INCLUDE,
      }),

      this.prismaService.enrollment.count({
        where,
      }),
    ]);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy danh sách đăng ký khóa học thành công',
      {
        items: enrollments.map(mapEnrollmentResponse),

        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    );
  }

  async findById(user: any, id: string) {
    const enrollment = await this.prismaService.enrollment.findUnique({
      where: {
        id,
      },

      include: ENROLLMENT_INCLUDE,
    });

    if (!enrollment) {
      throw new BadRequestException('Không tìm thấy đăng ký khóa học');
    }

    if (user.role === Role.TEACHER) {
      if (enrollment.course.teacherId !== user.teacherId) {
        throw new ForbiddenException();
      }
    }

    if (user.role === Role.STUDENT) {
      if (enrollment.studentId !== user.studentId) {
        throw new ForbiddenException();
      }
    }

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy chi tiết đăng ký khóa học thành công',
      mapEnrollmentResponse(enrollment),
    );
  }

  async update(id: string, dto: UpdateEnrollmentDto) {
    await this.getEnrollmentByIdOrThrow(id);

    await this.prismaService.enrollment.update({
      where: {
        id,
      },

      data: {
        ...dto,
      },

      include: ENROLLMENT_INCLUDE,
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Cập nhật đăng ký khóa học thành công',
      null,
    );
  }

  async remove(id: string) {
    await this.getEnrollmentByIdOrThrow(id);

    await this.prismaService.enrollment.update({
      where: {
        id,
      },

      data: {
        status: EnrollmentStatus.CANCELLED,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Xóa đăng ký khóa học thành công',
      null,
    );
  }
}

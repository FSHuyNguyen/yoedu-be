import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CourseClass, EnrollmentStatus, Prisma, Role } from '@prisma/client';

import { StudentService } from '../student/student.service';
import { CourseClassService } from '../course-class/course-class.service';

import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EnrollmentQueryDto } from './dto/query-enrollment.dto';
import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';
import {
  ENROLLMENT_INCLUDE,
  EnrollmentResponse,
  mapEnrollmentResponse,
} from './mappers/enrollment.mapper';
import type { AuthUser } from '../auth/types/auth-jwt-user.type';

@Injectable()
export class EnrollmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly studentService: StudentService,
    private readonly courseClassService: CourseClassService,
  ) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  async getEnrollmentByIdOrThrow(id: string) {
    const enrollment = await this.prismaService.enrollment.findUnique({
      where: {
        id,
      },
      include: ENROLLMENT_INCLUDE,
    });

    if (!enrollment) {
      throw new NotFoundException('Không tìm thấy đăng ký khóa học');
    }

    return enrollment;
  }

  async getEnrollmentByStudentAndCourseClassOrThrow(
    studentId: string,
    courseClassId: string,
  ) {
    const enrollment = await this.prismaService.enrollment.findUnique({
      where: {
        studentId_courseClassId: {
          studentId,
          courseClassId,
        },
      },
      include: ENROLLMENT_INCLUDE,
    });

    if (!enrollment) {
      throw new NotFoundException('Học viên chưa tham gia lớp học này');
    }

    return enrollment;
  }

  private async validateStudentCanEnroll(
    studentId: string,
    courseClass: CourseClass,
  ) {
    const existedEnrollment = await this.prismaService.enrollment.findFirst({
      where: {
        studentId,
        status: {
          not: EnrollmentStatus.CANCELLED,
        },
        courseClass: {
          courseId: courseClass.courseId,
        },
      },
    });

    if (existedEnrollment) {
      throw new BadRequestException('Học viên đã đăng ký khóa học này');
    }
  }

  private async validateCourseClassCapacity(
    courseClassId: string,
    maxStudents?: number | null,
  ) {
    if (!maxStudents) {
      return;
    }

    const currentStudents = await this.prismaService.enrollment.count({
      where: {
        courseClassId,
        status: {
          not: EnrollmentStatus.CANCELLED,
        },
      },
    });

    if (currentStudents >= maxStudents) {
      throw new BadRequestException('Lớp học đã đầy');
    }
  }

  private validateEnrollmentPermission(
    user: AuthUser,
    enrollment: EnrollmentResponse,
  ) {
    if (user.role === Role.TEACHER) {
      const isTeacherOfClass =
        enrollment.courseClass.mainTeacherId === user.teacherId ||
        enrollment.courseClass.assistantTeacherId === user.teacherId;

      if (!isTeacherOfClass) {
        throw new ForbiddenException('Bạn không có quyền truy cập đăng ký này');
      }
    }

    if (user.role === Role.STUDENT) {
      if (enrollment.studentId !== user.studentId) {
        throw new ForbiddenException('Bạn không có quyền truy cập đăng ký này');
      }
    }
  }

  async create(dto: CreateEnrollmentDto) {
    await this.studentService.getStudentByIdOrThrow(dto.studentId);

    const courseClass = await this.courseClassService.getCourseClassByIdOrThrow(
      dto.courseClassId,
    );

    await this.validateStudentCanEnroll(dto.studentId, courseClass);

    await this.validateCourseClassCapacity(
      dto.courseClassId,
      courseClass.maxStudents,
    );

    await this.prismaService.enrollment.create({
      data: dto,
    });

    return CustomResponse(
      true,
      StatusCode.CREATED,
      'Đăng ký lớp học thành công',
      null,
    );
  }

  async update(user: AuthUser, id: string, dto: UpdateEnrollmentDto) {
    const enrollment = await this.getEnrollmentByIdOrThrow(id);

    this.validateEnrollmentPermission(user, enrollment);

    await this.prismaService.enrollment.update({
      where: {
        id,
      },
      data: dto,
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Cập nhật đăng ký khóa học thành công',
      null,
    );
  }

  async findAll(user: AuthUser, query: EnrollmentQueryDto) {
    const {
      page = 1,
      limit = 10,
      status,
      studentId,
      courseClassId,
      courseId,
      keySearch,
    } = query;

    const skip = (page - 1) * limit;

    const andConditions: Prisma.EnrollmentWhereInput[] = [];

    /********************
     * PERMISSION
     ********************/

    if (user.role === Role.TEACHER && user.teacherId) {
      andConditions.push({
        OR: [
          {
            courseClass: {
              mainTeacherId: user.teacherId,
            },
          },
          {
            courseClass: {
              assistantTeacherId: user.teacherId,
            },
          },
        ],
      });
    }

    if (user.role === Role.STUDENT && user.studentId) {
      andConditions.push({
        studentId: user.studentId,
      });
    }

    /********************
     * FILTERS
     ********************/

    if (status) {
      andConditions.push({
        status,
      });
    }

    // Chỉ Admin/Teacher mới được filter theo studentId
    if (studentId && user.role !== Role.STUDENT) {
      andConditions.push({
        studentId,
      });
    }

    if (courseClassId) {
      andConditions.push({
        courseClassId,
      });
    }

    if (courseId) {
      andConditions.push({
        courseClass: {
          courseId,
        },
      });
    }

    /********************
     * SEARCH
     ********************/

    if (keySearch) {
      andConditions.push({
        OR: [
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
            courseClass: {
              name: {
                contains: keySearch,
                mode: 'insensitive',
              },
            },
          },
        ],
      });
    }

    const where: Prisma.EnrollmentWhereInput =
      andConditions.length > 0
        ? {
            AND: andConditions,
          }
        : {};

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

  async findById(user: AuthUser, id: string) {
    const enrollment = await this.getEnrollmentByIdOrThrow(id);

    this.validateEnrollmentPermission(user, enrollment);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy chi tiết đăng ký khóa học thành công',
      mapEnrollmentResponse(enrollment),
    );
  }

  async drop(user: AuthUser, id: string) {
    const enrollment = await this.getEnrollmentByIdOrThrow(id);

    this.validateEnrollmentPermission(user, enrollment);

    if (enrollment.status === EnrollmentStatus.DROPPED) {
      throw new BadRequestException('Đăng ký đã bị nghỉ giữa chừng trước đó');
    }

    await this.prismaService.enrollment.update({
      where: {
        id,
      },
      data: {
        status: EnrollmentStatus.DROPPED,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Tạm dừng đăng ký khóa học thành công',
      null,
    );
  }

  async pause(user: AuthUser, id: string) {
    const enrollment = await this.getEnrollmentByIdOrThrow(id);

    this.validateEnrollmentPermission(user, enrollment);

    if (enrollment.status === EnrollmentStatus.PAUSED) {
      throw new BadRequestException('Đăng ký đã bị tạm dừng trước đó');
    }

    await this.prismaService.enrollment.update({
      where: {
        id,
      },
      data: {
        status: EnrollmentStatus.PAUSED,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Tạm dừng đăng ký khóa học thành công',
      null,
    );
  }

  async active(user: AuthUser, id: string) {
    const enrollment = await this.getEnrollmentByIdOrThrow(id);

    this.validateEnrollmentPermission(user, enrollment);

    if (enrollment.status === EnrollmentStatus.ACTIVE) {
      throw new BadRequestException('Đăng ký đã được kích hoạt trước đó');
    }

    if (enrollment.status === EnrollmentStatus.COMPLETED) {
      throw new BadRequestException(
        'Không thể kích hoạt đăng ký đã hoàn thành',
      );
    }

    await this.prismaService.enrollment.update({
      where: {
        id,
      },
      data: {
        status: EnrollmentStatus.ACTIVE,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Kích hoạt đăng ký khóa học thành công',
      null,
    );
  }

  async remove(user: AuthUser, id: string) {
    const enrollment = await this.getEnrollmentByIdOrThrow(id);

    this.validateEnrollmentPermission(user, enrollment);

    if (enrollment.status === EnrollmentStatus.CANCELLED) {
      throw new BadRequestException('Đăng ký đã bị hủy trước đó');
    }

    if (enrollment.status === EnrollmentStatus.COMPLETED) {
      throw new BadRequestException('Không thể hủy đăng ký đã hoàn thành');
    }

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
      'Hủy đăng ký khóa học thành công',
      null,
    );
  }
}

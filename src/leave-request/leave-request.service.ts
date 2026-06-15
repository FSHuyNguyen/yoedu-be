import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { CustomResponse } from '../shared/utils/response';
import { PrismaService } from '../prisma/prisma.service';
import { StudentService } from '../student/student.service';
import { StatusCode } from '../shared/utils/status';
import type { AuthUser } from '../auth/types/auth-jwt-user.type';
import { LeaveRequestQueryDto } from './dto/query-create-leave-request.dto';
import { LeaveRequestStatus, Prisma } from '@prisma/client';
import {
  LEAVE_REQUEST_INCLUDE,
  mapLeaveRequestResponse,
} from './mappers/leave-request.mapper';
import { CourseClassSessionService } from '../course-class-session/course-class-session.service';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { EnrollmentService } from '../enrollment/enrollment.service';

@Injectable()
export class LeaveRequestService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly studentService: StudentService,
    private readonly courseClassSessionService: CourseClassSessionService,
    private readonly enrollmentService: EnrollmentService,
  ) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  async getLeaveRequestByIdOrThrow(id: string) {
    const leaveRequest = await this.prismaService.leaveRequest.findUnique({
      where: {
        id,
      },
      include: LEAVE_REQUEST_INCLUDE,
    });

    if (!leaveRequest) {
      throw new NotFoundException('Không tìm thấy đơn xin nghỉ');
    }

    return leaveRequest;
  }

  private async checkStatusPendingLeaveRequest(leaveRequestId: string) {
    const leaveRequest = await this.getLeaveRequestByIdOrThrow(leaveRequestId);

    if (leaveRequest.status !== LeaveRequestStatus.PENDING) {
      throw new BadRequestException(
        'Chỉ có thể hủy đơn xin nghỉ đang ở trạng thái Đang chờ',
      );
    }

    return leaveRequest;
  }

  async create(currentUser: AuthUser, dto: CreateLeaveRequestDto) {
    const studentId = currentUser.studentId;

    if (!studentId) {
      throw new BadRequestException('Người dùng không phải là học sinh');
    }

    const { sessionId, reason } = dto;

    await this.studentService.getStudentByIdOrThrow(studentId);

    const session =
      await this.courseClassSessionService.getCourseClassSessionByIdOrThrow(
        sessionId,
      );

    await this.enrollmentService.getEnrollmentByStudentAndCourseClassOrThrow(
      studentId,
      session.courseClassId,
    );

    const existedLeaveRequest =
      await this.prismaService.leaveRequest.findUnique({
        where: {
          studentId_sessionId: {
            studentId,
            sessionId,
          },
        },
      });

    if (existedLeaveRequest) {
      throw new ConflictException('Đơn xin nghỉ đã tồn tại');
    }

    await this.prismaService.leaveRequest.create({
      data: {
        studentId,
        sessionId,
        reason,
      },
    });

    return CustomResponse(
      true,
      StatusCode.CREATED,
      'Tạo đơn xin nghỉ thành công',
      null,
    );
  }

  async update(id: string, dto: UpdateLeaveRequestDto) {
    const { sessionId, reason } = dto;

    const leaveRequest = await this.checkStatusPendingLeaveRequest(id);

    if (dto.sessionId) {
      const duplicated = await this.prismaService.leaveRequest.findFirst({
        where: {
          studentId: leaveRequest.studentId,
          sessionId: dto.sessionId,
          NOT: {
            id,
          },
        },
      });

      if (duplicated) {
        throw new ConflictException('Đã tồn tại đơn xin nghỉ cho buổi học này');
      }
    }

    await this.prismaService.leaveRequest.update({
      where: {
        id,
      },
      data: {
        sessionId,
        reason,
      },
    });

    return CustomResponse(
      true,
      StatusCode.CREATED,
      'Cập nhật đơn xin nghỉ thành công',
      null,
    );
  }

  async findAllMe(currentUser: AuthUser, query: LeaveRequestQueryDto) {
    const studentId = currentUser.studentId;
    const { page = 1, limit = 10, sessionId, status } = query;

    if (!studentId) {
      throw new BadRequestException('Người dùng không phải là học sinh');
    }

    await this.studentService.getStudentByIdOrThrow(studentId);

    const skip = (page - 1) * limit;

    const andConditions: Prisma.LeaveRequestWhereInput[] = [
      {
        studentId,
      },
    ];

    if (status) {
      andConditions.push({
        status,
      });
    }

    if (sessionId) {
      andConditions.push({
        sessionId,
      });
    }

    const where: Prisma.LeaveRequestWhereInput =
      andConditions.length > 0
        ? {
            AND: andConditions,
          }
        : {};

    const [leaveRequests, total] = await Promise.all([
      this.prismaService.leaveRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: LEAVE_REQUEST_INCLUDE,
      }),

      this.prismaService.leaveRequest.count({
        where,
      }),
    ]);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy danh sách đơn xin nghỉ thành công',
      {
        items: leaveRequests.map(mapLeaveRequestResponse),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    );
  }

  async remove(id: string) {
    await this.checkStatusPendingLeaveRequest(id);

    await this.prismaService.leaveRequest.delete({
      where: {
        id,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Xóa phiếu xin nghỉ thành công',
      null,
    );
  }

  async findAll(query: LeaveRequestQueryDto) {
    const { page = 1, limit = 10, sessionId, studentId, status } = query;

    const skip = (page - 1) * limit;

    const andConditions: Prisma.LeaveRequestWhereInput[] = [];

    if (status) {
      andConditions.push({
        status,
      });
    }

    if (sessionId) {
      andConditions.push({
        sessionId,
      });
    }

    if (studentId) {
      andConditions.push({
        studentId,
      });
    }

    const where: Prisma.LeaveRequestWhereInput =
      andConditions.length > 0
        ? {
            AND: andConditions,
          }
        : {};

    const [leaveRequests, total] = await Promise.all([
      this.prismaService.leaveRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: LEAVE_REQUEST_INCLUDE,
      }),

      this.prismaService.leaveRequest.count({
        where,
      }),
    ]);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy danh sách đơn xin nghỉ thành công',
      {
        items: leaveRequests.map(mapLeaveRequestResponse),
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
    const leaveRequest = await this.getLeaveRequestByIdOrThrow(id);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy chi tiết đơn xin nghỉ thành công',
      mapLeaveRequestResponse(leaveRequest),
    );
  }

  async approve(currentUser: AuthUser, id: string) {
    await this.checkStatusPendingLeaveRequest(id);

    await this.prismaService.leaveRequest.update({
      where: {
        id,
      },
      data: {
        status: LeaveRequestStatus.APPROVED,
        reviewerId: currentUser.id,
      },
    });
  }

  async reject(currentUser: AuthUser, id: string) {
    await this.checkStatusPendingLeaveRequest(id);

    await this.prismaService.leaveRequest.update({
      where: {
        id,
      },
      data: {
        status: LeaveRequestStatus.REJECTED,
        reviewerId: currentUser.id,
      },
    });
  }
}

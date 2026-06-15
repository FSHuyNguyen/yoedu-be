import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ATTENDANCE_INCLUDE,
  COURSE_CLASS_SESSION_INCLUDE,
  CourseClassSessionResponse,
  mapCourseClassSessionAttendanceResponse,
  mapCourseClassSessionCalendarResponse,
  mapCourseClassSessionResponse,
} from './mappers/course-class-session.mapper';
import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';
import { CourseClassSessionQueryDto } from './dto/query-create-course-class-session.dto';
import {
  AttendanceStatus,
  EnrollmentStatus,
  LeaveRequestStatus,
  Prisma,
  Role,
  SessionStatus,
} from '@prisma/client';
import { startOfDay, endOfDay, formatDate } from 'date-fns';
import { CourseClassSessionCalendarQueryDto } from './dto/query-calendar-course-class-session.dto';
import { BASE_USER_INCLUDE } from '../user/constants/user.constants';
import { TakeAttendanceDto } from './dto/take-attendance.dto';
import type { AuthUser } from '../auth/types/auth-jwt-user.type';
import { mappedWeekday } from '../schedule/mappers/schedule.mapper';

@Injectable()
export class CourseClassSessionService {
  constructor(private readonly prismaService: PrismaService) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  async getCourseClassSessionByIdOrThrow(
    courseClassSessionId: string,
  ): Promise<CourseClassSessionResponse> {
    const courseClassSession =
      await this.prismaService.courseClassSession.findUnique({
        where: {
          id: courseClassSessionId,
        },
        include: COURSE_CLASS_SESSION_INCLUDE,
      });

    if (!courseClassSession) {
      throw new NotFoundException('Không tìm thấy ca học');
    }

    return courseClassSession;
  }

  /* 
      Chỉ lấy những lớp chưa kết thúc để hiển thị trong dropdown khi tạo mới hoặc cập nhật lớp học, tránh việc chọn nhầm lớp đã kết thúc
    */
  async getCourseClassSessionOptions() {
    const courseClassSessions =
      await this.prismaService.courseClassSession.findMany({
        where: {
          status: SessionStatus.SCHEDULED,
        },
        include: COURSE_CLASS_SESSION_INCLUDE,
      });

    return courseClassSessions.map((courseClassSession) => ({
      value: courseClassSession.id,
      label: `${courseClassSession.courseClass.course.name} - ${courseClassSession.courseClass.name} - ${mappedWeekday[courseClassSession.scheduleSlot.weekday]} (${formatDate(courseClassSession.startTime, 'dd/MM/yyyy HH:mm')} - ${formatDate(courseClassSession.endTime, 'dd/MM/yyyy HH:mm')})`,
    }));
  }

  private buildSessionPermissionWhere(
    user: AuthUser,
  ): Prisma.CourseClassSessionWhereInput {
    switch (user.role) {
      case Role.ADMIN:
      case Role.STAFF:
        return {};

      case Role.TEACHER:
        return {
          courseClass: {
            OR: [
              {
                mainTeacherId: user.teacherId!,
              },
              {
                assistantTeacherId: user.teacherId!,
              },
            ],
          },
        };

      case Role.STUDENT:
        return {
          courseClass: {
            enrollments: {
              some: {
                studentId: user.studentId!,
                status: EnrollmentStatus.ACTIVE,
              },
            },
          },
        };

      case Role.PARENT:
        return {
          courseClass: {
            enrollments: {
              some: {
                status: EnrollmentStatus.ACTIVE,

                student: {
                  parentId: user.parentId!,
                },
              },
            },
          },
        };

      default:
        return {
          id: '__NO_PERMISSION__',
        };
    }
  }

  async findAll(currentUser: AuthUser, query: CourseClassSessionQueryDto) {
    const {
      page = 1,
      limit = 10,

      courseId,
      courseClassId,
      mainTeacherId,
      scheduleSlotId,
      startDate,
      endDate,
    } = query;

    const skip = (page - 1) * limit;
    const andConditions: Prisma.CourseClassSessionWhereInput[] = [];

    const courseClassFilter: Prisma.CourseClassWhereInput = {};

    if (courseId) {
      courseClassFilter.courseId = courseId;
    }

    if (mainTeacherId) {
      courseClassFilter.mainTeacherId = mainTeacherId;
    }

    if (courseClassId) {
      courseClassFilter.id = courseClassId;
    }

    if (Object.keys(courseClassFilter).length > 0) {
      andConditions.push({
        courseClass: courseClassFilter,
      });
    }

    if (scheduleSlotId) {
      andConditions.push({
        scheduleSlotId,
      });
    }

    if (startDate || endDate) {
      andConditions.push({
        startTime: {
          ...(startDate && {
            gte: startOfDay(new Date(startDate)),
          }),
          ...(endDate && {
            lte: endOfDay(new Date(endDate)),
          }),
        },
      });
    }

    const permissionWhere = this.buildSessionPermissionWhere(currentUser);

    const where: Prisma.CourseClassSessionWhereInput = {
      AND: [permissionWhere, ...andConditions],
    };

    const [courseClassesSession, total] = await Promise.all([
      this.prismaService.courseClassSession.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: COURSE_CLASS_SESSION_INCLUDE,
      }),
      this.prismaService.courseClassSession.count({
        where,
      }),
    ]);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy danh sách ca học thành công',
      {
        items: courseClassesSession.map(mapCourseClassSessionResponse),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    );
  }

  async calendar(
    currentUser: AuthUser,
    query: CourseClassSessionCalendarQueryDto,
  ) {
    const { startDate, endDate } = query;

    const permissionWhere = this.buildSessionPermissionWhere(currentUser);

    const dateWhere: Prisma.CourseClassSessionWhereInput = {};

    if (startDate || endDate) {
      dateWhere.startTime = {
        ...(startDate && {
          gte: startOfDay(new Date(startDate)),
        }),
        ...(endDate && {
          lte: endOfDay(new Date(endDate)),
        }),
      };
    }

    const where: Prisma.CourseClassSessionWhereInput = {
      AND: [permissionWhere, dateWhere],
    };

    const sessions = await this.prismaService.courseClassSession.findMany({
      where,
      orderBy: {
        startTime: 'asc',
      },
      include: COURSE_CLASS_SESSION_INCLUDE,
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy dữ liệu calendar thành công',
      sessions.map(mapCourseClassSessionCalendarResponse),
    );
  }

  async findById(id: string) {
    const courseClassSession = await this.getCourseClassSessionByIdOrThrow(id);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy thông tin ca học thành công',
      mapCourseClassSessionResponse(courseClassSession),
    );
  }

  async markAsDone(id: string) {
    await this.getCourseClassSessionByIdOrThrow(id);

    await this.prismaService.courseClassSession.update({
      where: {
        id,
      },
      data: {
        status: SessionStatus.DONE,
      },
    });
  }

  async cancel(id: string) {
    await this.getCourseClassSessionByIdOrThrow(id);

    await this.prismaService.courseClassSession.update({
      where: {
        id,
      },
      data: {
        status: SessionStatus.CANCELLED,
      },
    });
  }

  /*************************************************************
   * Điểm danh (Attendance)
   *************************************************************/
  async attendance(id: string) {
    const session = await this.prismaService.courseClassSession.findUnique({
      where: {
        id,
      },

      include: {
        attendances: {
          include: ATTENDANCE_INCLUDE,
        },

        leaveRequests: {
          where: {
            status: LeaveRequestStatus.APPROVED,
          },
        },

        courseClass: {
          include: {
            enrollments: {
              where: {
                status: EnrollmentStatus.ACTIVE,
              },

              include: {
                student: {
                  include: BASE_USER_INCLUDE,
                },
              },
            },
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Không tìm thấy ca học');
    }

    const attendanceMap = new Map(
      session.attendances.map(
        (attendance) => [attendance.studentId, attendance] as const,
      ),
    );

    const leaveRequestMap = new Map(
      session.leaveRequests.map(
        (leaveRequest) => [leaveRequest.studentId, leaveRequest] as const,
      ),
    );

    const students = session.courseClass.enrollments.map((enrollment) => {
      const attendance = attendanceMap.get(enrollment.studentId);
      const leaveRequest = leaveRequestMap.get(enrollment.studentId);

      return {
        studentId: enrollment.student.id,
        studentCode: enrollment.student.studentCode,
        fullName: enrollment.student.user.fullName,

        attendanceId: attendance?.id ?? null,

        status:
          attendance?.status ??
          (leaveRequest ? AttendanceStatus.EXCUSED : null),

        note: attendance?.note ?? leaveRequest?.reason ?? null,
      };
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy danh sách điểm danh thành công',
      mapCourseClassSessionAttendanceResponse(session, students),
    );
  }

  async takeAttendance(
    userId: string,
    sessionId: string,
    dto: TakeAttendanceDto,
  ) {
    const session = await this.getCourseClassSessionByIdOrThrow(sessionId);

    const enrollments = await this.prismaService.enrollment.findMany({
      where: {
        courseClassId: session.courseClassId,
        status: EnrollmentStatus.ACTIVE,
      },

      select: {
        studentId: true,
      },
    });

    const enrolledStudentIds = new Set(
      enrollments.map((item) => item.studentId),
    );

    for (const attendance of dto.attendances) {
      if (!enrolledStudentIds.has(attendance.studentId)) {
        throw new BadRequestException('Học viên không thuộc lớp học');
      }
    }

    /* upsert giúp cho việc cập nhật nếu bản ghi đã tồn tại hoặc tạo mới nếu chưa có bản ghi điểm danh */
    await this.prismaService.$transaction(
      dto.attendances.map((attendance) =>
        this.prismaService.attendance.upsert({
          where: {
            sessionId_studentId: {
              sessionId,
              studentId: attendance.studentId,
            },
          },

          create: {
            sessionId,
            studentId: attendance.studentId,
            status: attendance.status,
            note: attendance.note,

            recordedByUserId: userId,
          },

          update: {
            status: attendance.status,
            note: attendance.note,

            recordedByUserId: userId,
          },
        }),
      ),
    );

    return CustomResponse(true, StatusCode.OK, 'Điểm danh thành công');
  }
}

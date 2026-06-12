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
import { EnrollmentStatus, Prisma, SessionStatus } from '@prisma/client';
import { startOfDay, endOfDay } from 'date-fns';
import { CourseClassSessionCalendarQueryDto } from './dto/query-calendar-course-class-session.dto';
import { BASE_USER_INCLUDE } from '../user/constants/user.constants';
import { TakeAttendanceDto } from './dto/take-attendance.dto';

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

  async findAll(query: CourseClassSessionQueryDto) {
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

    const where: Prisma.CourseClassSessionWhereInput = andConditions.length
      ? {
          AND: andConditions,
        }
      : {};

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

  async calendar(query: CourseClassSessionCalendarQueryDto) {
    const { startDate, endDate } = query;

    const where: Prisma.CourseClassSessionWhereInput = {};

    if (startDate || endDate) {
      where.startTime = {
        ...(startDate && {
          gte: startOfDay(new Date(startDate)),
        }),

        ...(endDate && {
          lte: endOfDay(new Date(endDate)),
        }),
      };
    }

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
      session.attendances.map((attendance) => [
        attendance.studentId,
        attendance,
      ]),
    );

    const students = session.courseClass.enrollments.map((enrollment) => {
      const attendance = attendanceMap.get(enrollment.studentId);

      return {
        studentId: enrollment.student.id,
        studentCode: enrollment.student.studentCode,
        fullName: enrollment.student.user.fullName,

        attendanceId: attendance?.id ?? null,
        status: attendance?.status ?? null,
        note: attendance?.note ?? null,
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

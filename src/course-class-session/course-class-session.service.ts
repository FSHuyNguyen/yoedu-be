import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  COURSE_CLASS_SESSION_INCLUDE,
  CourseClassSessionResponse,
  mapCourseClassSessionResponse,
} from './mappers/course-class-session.mapper';
import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';
import { CourseClassSessionQueryDto } from './dto/query-create-course-class-session.dto';
import { Prisma, SessionStatus } from '@prisma/client';
import { startOfDay, endOfDay } from 'date-fns';

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
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCourseClassSessionDto } from './dto/update-course-class-session.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  COURSE_CLASS_SESSION_INCLUDE,
  CourseClassSessionResponse,
  mapCourseClassSessionResponse,
} from './mappers/course-class-session.mapper';
import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';
import { CourseClassSessionQueryDto } from './dto/query-create-course-class-session.dto';
import { Prisma } from '@prisma/client';

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

  async update(id: string, dto: UpdateCourseClassSessionDto) {
    await this.getCourseClassSessionByIdOrThrow(id);

    console.log(dto);

    // await this.prismaService.$transaction(async (tx) => {
    //   await tx.courseClass.update({
    //     where: { id },
    //     data: {
    //       name: dto.name,
    //       courseId: dto.courseId,
    //       roomId: dto.roomId,

    //       mainTeacherId: dto.mainTeacherId,
    //       assistantTeacherId: dto.assistantTeacherId,

    //       startDate: dto.startDate ? new Date(dto.startDate) : undefined,

    //       endDate: dto.endDate ? new Date(dto.endDate) : undefined,

    //       maxStudents: dto.maxStudents,
    //       tuitionFee: dto.tuitionFee,
    //     },
    //   });

    //   if (dto.scheduleSlotIds) {
    //     await tx.courseClassSchedule.deleteMany({
    //       where: {
    //         courseClassId: id,
    //       },
    //     });

    //     await tx.courseClassSchedule.createMany({
    //       data: dto.scheduleSlotIds.map((scheduleSlotId) => ({
    //         courseClassId: id,
    //         scheduleSlotId,
    //       })),
    //     });
    //   }
    // });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Cập nhật lớp học thành công',
      null,
    );
  }

  async findAll(query: CourseClassSessionQueryDto) {
    const {
      page = 1,
      limit = 10,
      courseClassId,
      scheduleSlotId,
      startTime,
      endTime,
    } = query;

    const skip = (page - 1) * limit;
    const andConditions: Prisma.CourseClassSessionWhereInput[] = [];

    if (courseClassId) {
      andConditions.push({
        courseClassId,
      });
    }

    if (scheduleSlotId) {
      andConditions.push({
        scheduleSlotId,
      });
    }

    if (startTime) {
      andConditions.push({
        startTime: {
          gte: new Date(startTime),
        },
      });
    }

    if (endTime) {
      andConditions.push({
        endTime: {
          lte: new Date(endTime),
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
}

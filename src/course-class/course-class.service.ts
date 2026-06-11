import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseClassDto } from './dto/create-course-class.dto';
import { UpdateCourseClassDto } from './dto/update-course-class.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { generateCode } from '../shared/utils/generate-code';
import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';
import { CourseClassQueryDto } from './dto/query-course-class.dto';
import {
  COUSE_CLASS_INCLUDE,
  mapCourseClassResponse,
} from './mappers/course-class.mapper';
import { getCurrentWeekdayCustom } from '../utils/date';
import { addDays } from 'date-fns';

@Injectable()
export class CourseClassService {
  constructor(private readonly prismaService: PrismaService) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  async getCourseClassByIdOrThrow(courseClassId: string) {
    const courseClass = await this.prismaService.courseClass.findUnique({
      where: {
        id: courseClassId,
      },
      include: COUSE_CLASS_INCLUDE,
    });

    if (!courseClass) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    return courseClass;
  }

  private async generateSessions(courseClassId: string) {
    const courseClass = await this.prismaService.courseClass.findUnique({
      where: { id: courseClassId },
      include: {
        schedules: {
          include: { scheduleSlot: true },
        },
      },
    });

    if (!courseClass) throw new NotFoundException();

    let currentDate = new Date(courseClass.startDate);
    const end = new Date(courseClass.endDate);

    const sessions: Prisma.CourseClassSessionCreateManyInput[] = [];

    while (currentDate <= end) {
      const weekday = getCurrentWeekdayCustom(currentDate);

      const matchedSlots = courseClass.schedules.filter(
        (s) => s.scheduleSlot.weekday === weekday,
      );

      for (const slot of matchedSlots) {
        const [startHour, startMin] = slot.scheduleSlot.startTime
          .split(':')
          .map(Number);
        const [endHour, endMin] = slot.scheduleSlot.endTime
          .split(':')
          .map(Number);

        const sessionStart = new Date(currentDate);
        sessionStart.setHours(startHour, startMin, 0, 0);

        const sessionEnd = new Date(currentDate);
        sessionEnd.setHours(endHour, endMin, 0, 0);

        sessions.push({
          courseClassId,
          scheduleSlotId: slot.scheduleSlotId,
          startTime: sessionStart,
          endTime: sessionEnd,
        });
      }

      currentDate = addDays(currentDate, 1);
    }

    await this.prismaService.courseClassSession.createMany({
      data: sessions,
    });
  }

  /* 
    Chỉ lấy những lớp chưa kết thúc để hiển thị trong dropdown khi tạo mới hoặc cập nhật lớp học, tránh việc chọn nhầm lớp đã kết thúc
  */
  async getCourseClassOptions() {
    const now = new Date();

    const courseClasses = await this.prismaService.courseClass.findMany({
      where: {
        endDate: {
          gte: now,
        },
      },

      orderBy: {
        startDate: 'asc',
      },
    });

    return courseClasses.map((courseClass) => ({
      value: courseClass.id,
      label: courseClass.name,
    }));
  }

  async create(dto: CreateCourseClassDto) {
    const courseClass = await this.prismaService.courseClass.create({
      data: {
        name: dto.name,
        courseId: dto.courseId,
        roomId: dto.roomId,

        mainTeacherId: dto.mainTeacherId,
        assistantTeacherId: dto.assistantTeacherId,

        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),

        maxStudents: dto.maxStudents,
        tuitionFee: dto.tuitionFee,

        classCode: generateCode('CC'),

        schedules: {
          create: dto.scheduleSlotIds.map((scheduleSlotId) => ({
            scheduleSlotId,
          })),
        },
      },
    });

    await this.generateSessions(courseClass.id);

    return CustomResponse(
      true,
      StatusCode.CREATED,
      'Tạo lớp học thành công',
      null,
    );
  }

  async update(id: string, dto: UpdateCourseClassDto) {
    await this.getCourseClassByIdOrThrow(id);

    await this.prismaService.$transaction(async (tx) => {
      await tx.courseClass.update({
        where: { id },
        data: {
          name: dto.name,
          courseId: dto.courseId,
          roomId: dto.roomId,

          mainTeacherId: dto.mainTeacherId,
          assistantTeacherId: dto.assistantTeacherId,

          startDate: dto.startDate ? new Date(dto.startDate) : undefined,

          endDate: dto.endDate ? new Date(dto.endDate) : undefined,

          maxStudents: dto.maxStudents,
          tuitionFee: dto.tuitionFee,
        },
      });

      if (dto.scheduleSlotIds) {
        await tx.courseClassSchedule.deleteMany({
          where: {
            courseClassId: id,
          },
        });

        await tx.courseClassSchedule.createMany({
          data: dto.scheduleSlotIds.map((scheduleSlotId) => ({
            courseClassId: id,
            scheduleSlotId,
          })),
        });
      }
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Cập nhật lớp học thành công',
      null,
    );
  }

  async findAll(query: CourseClassQueryDto) {
    const {
      page = 1,
      limit = 10,

      courseId,
      roomId,
      scheduleSlotId,
      mainTeacherId,
      startDate,
      endDate,
      keySearch,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.CourseClassWhereInput = {};

    if (courseId) {
      where.courseId = courseId;
    }

    if (roomId) {
      where.roomId = roomId;
    }

    if (scheduleSlotId) {
      where.schedules = {
        some: {
          scheduleSlotId,
        },
      };
    }

    if (mainTeacherId) {
      where.mainTeacherId = mainTeacherId;
    }

    if (startDate) {
      where.startDate = {
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      where.endDate = {
        lte: new Date(endDate),
      };
    }

    if (keySearch) {
      where.OR = [
        {
          name: {
            contains: keySearch,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [courseClasses, total] = await Promise.all([
      this.prismaService.courseClass.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        include: COUSE_CLASS_INCLUDE,
      }),

      this.prismaService.courseClass.count({
        where,
      }),
    ]);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy danh sách lớp học thành công',
      {
        items: courseClasses.map(mapCourseClassResponse),

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
    const courseClass = await this.getCourseClassByIdOrThrow(id);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy thông tin lớp học thành công',
      mapCourseClassResponse(courseClass),
    );
  }
}

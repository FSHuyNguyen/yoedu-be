import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ScheduleSlot } from '@prisma/client';
import { StatusCode } from '../shared/utils/status';
import { generateCode } from '../shared/utils/generate-code';
import { CustomResponse } from '../shared/utils/response';
import { ScheduleQueryDto } from './dto/query-schedule.dto';
import { mapSchedule, mapScheduleResponse } from './mappers/schedule.mapper';

@Injectable()
export class ScheduleService {
  constructor(private readonly prismaService: PrismaService) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  async getScheduleByIdOrThrow(scheduleId: string): Promise<ScheduleSlot> {
    const schedule = await this.prismaService.scheduleSlot.findUnique({
      where: {
        id: scheduleId,
      },
    });

    if (!schedule) {
      throw new NotFoundException('Không tìm thấy lịch học');
    }

    return schedule;
  }

  async getScheduleOptions() {
    const schedules = await this.prismaService.scheduleSlot.findMany({
      orderBy: {
        weekday: 'asc',
      },
    });

    return schedules.map((schedule) => ({
      value: schedule.id,
      label: mapSchedule(schedule),
    }));
  }

  async create(dto: CreateScheduleDto) {
    await this.prismaService.scheduleSlot.create({
      data: {
        ...dto,
        slotCode: generateCode('SCH'),
      },
    });

    return CustomResponse(
      true,
      StatusCode.CREATED,
      'Tạo lịch học thành công',
      null,
    );
  }

  async update(id: string, dto: UpdateScheduleDto) {
    await this.getScheduleByIdOrThrow(id);

    await this.prismaService.scheduleSlot.update({
      where: {
        id,
      },

      data: {
        ...dto,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Cập nhật lịch học thành công',
      null,
    );
  }

  async findAll(query: ScheduleQueryDto) {
    const {
      page = 1,
      limit = 10,

      weekday,
      startTime,
      endTime,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ScheduleSlotWhereInput = {};

    if (weekday) {
      where.weekday = weekday;
    }

    if (startTime) {
      where.startTime = {
        gte: startTime,
      };
    }

    if (endTime) {
      where.endTime = {
        lte: endTime,
      };
    }

    const [schedules, total] = await Promise.all([
      this.prismaService.scheduleSlot.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prismaService.scheduleSlot.count({
        where,
      }),
    ]);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy danh sách lịch học thành công',
      {
        items: schedules.map(mapScheduleResponse),

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
    const schedule = await this.getScheduleByIdOrThrow(id);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy thông tin lịch học thành công',
      mapScheduleResponse(schedule),
    );
  }

  async remove(id: string) {
    await this.getScheduleByIdOrThrow(id);

    await this.prismaService.scheduleSlot.delete({
      where: {
        id,
      },
    });

    return CustomResponse(true, StatusCode.OK, 'Xóa lịch học thành công', null);
  }
}

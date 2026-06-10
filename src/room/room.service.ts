import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Room } from '@prisma/client';
import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';
import { generateCode } from '../shared/utils/generate-code';
import { RoomQueryDto } from './dto/query-room.dto';
import { mapRoomResponse } from './mappers/room.mapper';

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  async getRoomByIdOrThrow(roomId: string): Promise<Room> {
    const room = await this.prismaService.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      throw new NotFoundException('Không tìm thấy phòng học');
    }

    return room;
  }

  async getRoomOptions() {
    const rooms = await this.prismaService.room.findMany();

    return rooms.map((room) => ({
      value: room.id,
      label: room.name,
    }));
  }

  async create(dto: CreateRoomDto) {
    await this.prismaService.room.create({
      data: {
        ...dto,
        roomCode: generateCode('R'),
      },
    });

    return CustomResponse(
      true,
      StatusCode.CREATED,
      'Tạo phòng học thành công',
      null,
    );
  }

  async update(id: string, dto: UpdateRoomDto) {
    await this.getRoomByIdOrThrow(id);

    await this.prismaService.room.update({
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
      'Cập nhật phòng học thành công',
      null,
    );
  }

  async findAll(query: RoomQueryDto) {
    const {
      page = 1,
      limit = 10,

      keySearch,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.RoomWhereInput = {};

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

    const [rooms, total] = await Promise.all([
      this.prismaService.room.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prismaService.room.count({
        where,
      }),
    ]);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy danh sách phòng học thành công',
      {
        items: rooms.map(mapRoomResponse),

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
    const room = await this.getRoomByIdOrThrow(id);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy thông tin phòng học thành công',
      mapRoomResponse(room),
    );
  }

  async remove(id: string) {
    await this.getRoomByIdOrThrow(id);

    await this.prismaService.room.delete({
      where: {
        id,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Xóa phòng học thành công',
      null,
    );
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role, Status } from '@prisma/client';
import { CreateParentDto } from './dto/create-parent.dto';
import { encrypt } from '../shared/utils/bcrypt';
import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';
import { UpdateParentDto } from './dto/update-parent.dto';
import { ParentQueryDto } from './dto/query-parent.dto';
import { PARENT_INCLUDE, mapParentResponse } from './mappers/parrent.mapper';

@Injectable()
export class ParentService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  async getParentByIdOrThrow(parentId: string) {
    const parent = await this.prismaService.parent.findUnique({
      where: {
        id: parentId,
      },
      include: PARENT_INCLUDE,
    });

    if (!parent) {
      throw new NotFoundException('Không tìm thấy phụ huynh');
    }

    return parent;
  }

  async getParentOptions() {
    const parents = await this.prismaService.parent.findMany({
      where: {
        user: {
          role: Role.PARENT,
          status: Status.ACTIVE,
        },
      },
      include: PARENT_INCLUDE,
    });

    return parents.map((parent) => ({
      value: parent.id,
      label: parent.user.fullName,
    }));
  }

  async create(dto: CreateParentDto) {
    await this.userService.checkEmailExists(dto.email);

    const hashedPassword = await encrypt(dto.password);

    await this.prismaService.user.create({
      data: {
        email: dto.email,

        password: hashedPassword,

        fullName: dto.fullName,

        phone: dto.phone,

        address: dto.address,

        avatarUrl: dto.avatarUrl,

        gender: dto.gender,

        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,

        role: Role.PARENT,

        parent: {
          create: {},
        },
      },
    });

    return CustomResponse(
      true,
      StatusCode.CREATED,
      'Tạo phụ huynh thành công',
      null,
    );
  }

  async update(userId: string, dto: UpdateParentDto) {
    await this.userService.getUserByIdOrThrow(userId);

    if (dto.email) {
      await this.userService.checkEmailExists(dto.email, userId);
    }

    await this.prismaService.user.update({
      where: {
        id: userId,
      },

      data: {
        email: dto.email,

        fullName: dto.fullName,

        phone: dto.phone,

        address: dto.address,

        avatarUrl: dto.avatarUrl,

        gender: dto.gender,

        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Cập nhật thông tin phụ huynh thành công',
      null,
    );
  }

  async findAll(query: ParentQueryDto) {
    const { page = 1, limit = 10, keySearch } = query;

    const skip = (page - 1) * limit;

    const userWhere: Prisma.UserWhereInput = {
      role: Role.PARENT,
    };

    if (keySearch) {
      userWhere.OR = [
        {
          email: {
            contains: keySearch,
            mode: 'insensitive',
          },
        },

        {
          fullName: {
            contains: keySearch,
            mode: 'insensitive',
          },
        },
      ];
    }

    const where: Prisma.ParentWhereInput = {
      user: userWhere,
    };

    const [parents, total] = await Promise.all([
      this.prismaService.parent.findMany({
        where,

        skip,
        take: limit,

        include: PARENT_INCLUDE,

        orderBy: {
          user: {
            createdAt: 'desc',
          },
        },
      }),

      this.prismaService.parent.count({
        where,
      }),
    ]);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy danh sách phụ huynh thành công',
      {
        items: parents.map(mapParentResponse),

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
    const parent = await this.getParentByIdOrThrow(id);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy thông tin phụ huynh thành công',
      mapParentResponse(parent),
    );
  }
}

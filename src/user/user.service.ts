import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma, Status } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { comparePassword, hashPassword } from '../shared/utils/hash-password';

import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';

import { USER_DETAIL_SELECT, USER_SELECT } from './constants/user.constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserQueryDto } from './dto/query-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  async getUserByIdOrThrow(userId: string, isSelectFull = false) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: isSelectFull ? undefined : USER_DETAIL_SELECT,
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return user;
  }

  async checkEmailExists(email: string, userId?: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user && user.id !== userId) {
      throw new BadRequestException('Email đã tồn tại');
    }
  }

  /*************************************************************
   * USER
   *************************************************************/
  async getMe(userId: string) {
    const user = await this.getUserByIdOrThrow(userId);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy thông tin người dùng thành công',
      user,
    );
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    await this.getUserByIdOrThrow(userId);

    if (dto.email) {
      await this.checkEmailExists(dto.email, userId);
    }

    await this.prisma.user.update({
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
      'Cập nhật thông tin cá nhân thành công',
      null,
    );
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.getUserByIdOrThrow(userId, true);

    const isMatch = await comparePassword(dto.oldPassword, user.password);

    if (!isMatch) {
      throw new BadRequestException('Mật khẩu cũ không đúng');
    }

    const hashedPassword = await hashPassword(dto.newPassword);

    await this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        password: hashedPassword,
      },
    });

    return CustomResponse(true, StatusCode.OK, 'Đổi mật khẩu thành công', null);
  }

  /*************************************************************
   * ADMIN
   *************************************************************/
  async findAll(query: UserQueryDto) {
    const { page = 1, limit = 10, status, keySearch } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (keySearch) {
      where.OR = [
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

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,

        skip,
        take: limit,

        select: USER_SELECT,

        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.user.count({
        where,
      }),
    ]);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy danh sách người dùng thành công',
      {
        items: users,

        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    );
  }

  async findById(userId: string) {
    const user = await this.getUserByIdOrThrow(userId);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy thông tin người dùng thành công',
      user,
    );
  }

  async changeStatus(userId: string) {
    const user = await this.getUserByIdOrThrow(userId);

    const newStatus =
      user.status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE;

    await this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        status: newStatus,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Thay đổi trạng thái thành công',
      null,
    );
  }

  async remove(userId: string) {
    const user = await this.getUserByIdOrThrow(userId);

    if (user.status === Status.DELETED) {
      throw new BadRequestException('Người dùng đã bị xóa trước đó');
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        status: Status.DELETED,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Xóa người dùng thành công',
      null,
    );
  }
}

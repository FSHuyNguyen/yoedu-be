import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma, Status } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { compare, encrypt } from '../shared/utils/bcrypt';

import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';

import { USER_DETAIL_SELECT, USER_SELECT } from './constants/user.constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserQueryDto } from './dto/query-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  async getUserByIdOrThrow(userId: string, isSelectFull = false) {
    const user = await this.prismaService.user.findUnique({
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
    const user = await this.prismaService.user.findUnique({
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
      'Cập nhật thông tin cá nhân thành công',
      null,
    );
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.getUserByIdOrThrow(userId, true);

    const isMatch = await compare(dto.oldPassword, user.password);

    if (!isMatch) {
      throw new BadRequestException('Mật khẩu cũ không đúng');
    }

    const hashedPassword = await encrypt(dto.newPassword);

    await this.prismaService.user.update({
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
  async create(dto: CreateUserDto) {
    await this.checkEmailExists(dto.email);

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

        // role: Role.STUDENT,
      },
    });

    return CustomResponse(
      true,
      StatusCode.CREATED,
      'Tạo tài khoản thành công',
      null,
    );
  }

  async update(userId: string, dto: UpdateUserDto) {
    await this.getUserByIdOrThrow(userId);

    if (dto.email) {
      await this.checkEmailExists(dto.email, userId);
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
      'Cập nhật thông tin tài khoản thành công',
      null,
    );
  }

  async findAll(query: UserQueryDto) {
    const { page = 1, limit = 10, status, role, keySearch } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (role) {
      where.role = role;
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
      this.prismaService.user.findMany({
        where,

        skip,
        take: limit,

        select: USER_SELECT,

        orderBy: {
          createdAt: 'asc',
        },
      }),

      this.prismaService.user.count({
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

  async active(userId: string) {
    await this.getUserByIdOrThrow(userId);

    await this.prismaService.user.update({
      where: {
        id: userId,
      },

      data: {
        status: Status.ACTIVE,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Thay đổi trạng thái thành công',
      null,
    );
  }

  async unActive(userId: string) {
    await this.getUserByIdOrThrow(userId);

    await this.prismaService.user.update({
      where: {
        id: userId,
      },

      data: {
        status: Status.INACTIVE,
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
    await this.getUserByIdOrThrow(userId);

    await this.prismaService.user.update({
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

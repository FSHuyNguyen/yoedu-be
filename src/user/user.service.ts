import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';

import { CustomResponse } from '../../utils/response';
import { StatusCode } from '../../utils/status';

import { comparePassword, hashPassword } from '../../utils/hash-password';
import { UserFiltersDto } from './dto/user-filter.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.findById(userId);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy thông tin người dùng thành công',
      {
        user,
      },
    );
  }

  async findAll(filters: UserFiltersDto) {
    const { page = 1, limit = 10, status, keySearch } = filters;

    const skip = (page - 1) * limit;

    const where: any = {};

    // filter status
    if (status) {
      where.status = status;
    }

    // search
    if (keySearch) {
      where.OR = [
        {
          email: {
            contains: keySearch,
            mode: 'insensitive', // Không phân biệt hoa thường
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

        include: {
          student: true,
          teacher: true,
        },

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
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      include: {
        student: true,
        teacher: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async checkEmailExists(email: string) {
    const user = await this.findByEmail(email);

    if (user) {
      throw new BadRequestException('Email đã tồn tại');
    }
  }

  async changeStatus(userId: string) {
    const user = await this.findById(userId);

    if (user.status === Status.DELETED) {
      throw new BadRequestException('Deleted user cannot change status');
    }

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
    const user = await this.findById(userId);

    if (user.status === Status.DELETED) {
      throw new BadRequestException('User already deleted');
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        status: Status.DELETED,
      },
    });

    return CustomResponse(true, StatusCode.OK, 'Xóa user thành công', null);
  }

  async restore(userId: string) {
    const user = await this.findById(userId);

    if (user.status !== Status.DELETED) {
      throw new BadRequestException('User is not deleted');
    }

    await this.prisma.user.update({
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
      'Khôi phục user thành công',
      null,
    );
  }

  async updateProfile(
    userId: string,
    dto: {
      fullName?: string;
      phone?: string;
    },
  ) {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
      },
      include: {
        student: true,
        teacher: true,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Cập nhật thông tin cá nhân thành công',
      updatedUser,
    );
  }

  async changePassword(
    userId: string,
    dto: {
      oldPassword: string;
      newPassword: string;
    },
  ) {
    const user = await this.findById(userId);

    const isMatch = await comparePassword(dto.oldPassword, user.password);

    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
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
}

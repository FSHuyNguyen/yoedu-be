import { Injectable } from '@nestjs/common';
import { CustomResponse } from '../../utils/response';
import { StatusCode } from '../../utils/status';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'User info retrieved successfully',
      { user },
    );
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'User info updated successfully',
      { user },
    );
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'User info retrieved successfully',
      { user },
    );
  }
}

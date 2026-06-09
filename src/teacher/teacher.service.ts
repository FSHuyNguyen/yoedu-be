import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { BASE_USER_INCLUDE } from '../user/constants/user.constants';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { encrypt } from '../shared/utils/bcrypt';
import { generateCode } from '../shared/utils/generate-code';
import { Prisma, Role, Status, TeacherStatus } from '@prisma/client';
import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';
import { TeacherQueryDto } from './dto/query-teacher.dto';
import { mapTeacherResponse } from './mappers/teacher.mapper';

@Injectable()
export class TeacherService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  async getTeacherByIdOrThrow(teacherId: string) {
    const teacher = await this.prismaService.teacher.findUnique({
      where: {
        id: teacherId,
      },

      include: BASE_USER_INCLUDE,
    });

    if (!teacher) {
      throw new NotFoundException('Không tìm thấy giáo viên');
    }

    return teacher;
  }

  async getTeacherOptions() {
    const teachers = await this.prismaService.teacher.findMany({
      where: {
        status: TeacherStatus.ACTIVE,
        user: {
          role: Role.TEACHER,
          status: Status.ACTIVE,
        },
      },
      include: BASE_USER_INCLUDE,
    });

    return teachers.map((teacher) => ({
      value: teacher.id,
      label: teacher.user.fullName,
    }));
  }

  async create(dto: CreateTeacherDto) {
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

        role: Role.TEACHER,

        teacher: {
          create: {
            teacherCode: generateCode(Role.TEACHER),

            teacherRole: dto.teacherRole,

            specialization: dto.specialization,

            qualification: dto.qualification,

            yearsOfExperience: dto.yearsOfExperience,

            note: dto.note,
          },
        },
      },
    });

    return CustomResponse(
      true,
      StatusCode.CREATED,
      'Tạo giáo viên thành công',
      null,
    );
  }

  async update(userId: string, dto: UpdateTeacherDto) {
    await this.userService.getUserByIdOrThrow(userId);

    if (dto.email) {
      await this.userService.checkEmailExists(dto.email, userId);
    }

    await this.prismaService.$transaction([
      this.prismaService.user.update({
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
      }),

      this.prismaService.teacher.update({
        where: {
          userId,
        },

        data: {
          teacherRole: dto.teacherRole,

          specialization: dto.specialization,

          qualification: dto.qualification,

          yearsOfExperience: dto.yearsOfExperience,

          note: dto.note,
        },
      }),
    ]);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Cập nhật thông tin giáo viên thành công',
      null,
    );
  }

  async findAll(query: TeacherQueryDto) {
    const { page = 1, limit = 10, status, keySearch } = query;

    const skip = (page - 1) * limit;

    const userWhere: Prisma.UserWhereInput = {
      role: Role.TEACHER,
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

    const where: Prisma.TeacherWhereInput = {
      user: userWhere,
      status: status ? status : undefined,
    };

    const [teachers, total] = await Promise.all([
      this.prismaService.teacher.findMany({
        where,

        skip,
        take: limit,

        include: BASE_USER_INCLUDE,

        orderBy: {
          user: {
            createdAt: 'desc',
          },
        },
      }),

      this.prismaService.teacher.count({
        where,
      }),
    ]);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy danh sách giáo viên thành công',
      {
        items: teachers.map(mapTeacherResponse),

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
    const teacher = await this.getTeacherByIdOrThrow(id);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy thông tin giáo viên thành công',
      mapTeacherResponse(teacher),
    );
  }

  async active(teacherId: string) {
    await this.getTeacherByIdOrThrow(teacherId);

    await this.prismaService.teacher.update({
      where: {
        id: teacherId,
      },

      data: {
        status: TeacherStatus.ACTIVE,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Thay đổi trạng thái thành công',
      null,
    );
  }

  async paused(teacherId: string) {
    await this.getTeacherByIdOrThrow(teacherId);

    await this.prismaService.teacher.update({
      where: {
        id: teacherId,
      },

      data: {
        status: TeacherStatus.PAUSED,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Thay đổi trạng thái thành công',
      null,
    );
  }

  async remove(teacherId: string) {
    await this.getTeacherByIdOrThrow(teacherId);

    await this.prismaService.teacher.update({
      where: {
        id: teacherId,
      },

      data: {
        status: TeacherStatus.INACTIVE,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Xóa giáo viên thành công',
      null,
    );
  }
}

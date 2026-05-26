import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { USER_INCLUDE } from '../user/constants/user.constants';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { hashPassword } from '../shared/utils/hash-password';
import { generateCode } from '../shared/utils/generate-code';
import { Prisma, Role, Status } from '@prisma/client';
import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';
import { TeacherQueryDto } from './dto/teacher-query.dto';
import { mapTeacherResponse } from './mappers/teacher.mapper';

@Injectable()
export class TeacherService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  public async getTeacherByIdOrThrow(teacherId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        id: teacherId,
      },

      include: USER_INCLUDE,
    });

    if (!teacher) {
      throw new NotFoundException('Không tìm thấy giáo viên');
    }

    return teacher;
  }

  private async updateTeacherProfile(userId: string, dto: UpdateTeacherDto) {
    await this.userService.getUserByIdOrThrow(userId);

    if (dto.email) {
      await this.userService.checkEmailExists(dto.email, userId);
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
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

      this.prisma.teacher.update({
        where: {
          userId,
        },

        data: {
          bio: dto.bio,

          specialization: dto.specialization,

          qualification: dto.qualification,

          yearsOfExperience: dto.yearsOfExperience,

          note: dto.note,
        },
      }),
    ]);
  }

  async getActiveTeachers() {
    const teachers = await this.prisma.teacher.findMany({
      where: {
        user: {
          role: Role.TEACHER,
          status: Status.ACTIVE,
        },
      },
      include: USER_INCLUDE,
    });

    return teachers.map((teacher) => ({
      value: teacher.id,
      label: teacher.user.fullName,
    }));
  }

  /*************************************************************
   * ADMIN
   *************************************************************/
  async create(dto: CreateTeacherDto) {
    await this.userService.checkEmailExists(dto.email);

    const hashedPassword = await hashPassword(dto.password);

    await this.prisma.user.create({
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

            bio: dto.bio,

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

  async findAll(query: TeacherQueryDto) {
    const { page = 1, limit = 10, status, keySearch } = query;

    const skip = (page - 1) * limit;

    const userWhere: Prisma.UserWhereInput = {
      role: Role.TEACHER,
    };

    if (status) {
      userWhere.status = status;
    }

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
    };

    const [teachers, total] = await Promise.all([
      this.prisma.teacher.findMany({
        where,

        skip,
        take: limit,

        include: USER_INCLUDE,

        orderBy: {
          user: {
            createdAt: 'desc',
          },
        },
      }),

      this.prisma.teacher.count({
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

  async updateTeacherByAdmin(userId: string, dto: UpdateTeacherDto) {
    await this.updateTeacherProfile(userId, dto);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Cập nhật thông tin giáo viên thành công',
      null,
    );
  }

  /*************************************************************
   * TEACHER
   *************************************************************/
  async updateMe(userId: string, dto: UpdateTeacherDto) {
    await this.updateTeacherProfile(userId, dto);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Cập nhật thông tin giáo viên thành công',
      null,
    );
  }
}

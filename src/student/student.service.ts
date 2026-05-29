import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';

import { generateCode } from '../shared/utils/generate-code';
import { hashPassword } from '../shared/utils/hash-password';

import { UserService } from '../user/user.service';

import { mapStudentResponse } from './mappers/student.mapper';
import { ActivityType, Prisma, Role, Status } from '@prisma/client';
import { StudentQueryDto } from './dto/query-student.dto';
import { USER_INCLUDE } from '../user/constants/user.constants';

@Injectable()
export class StudentService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  public async getStudentByIdOrThrow(studentId: string) {
    const student = await this.prismaService.student.findUnique({
      where: {
        id: studentId,
      },

      include: USER_INCLUDE,
    });

    if (!student) {
      throw new NotFoundException('Không tìm thấy học viên');
    }

    return student;
  }

  async getStudentOptions() {
    const students = await this.prismaService.student.findMany({
      where: {
        user: {
          role: Role.STUDENT,
          status: Status.ACTIVE,
        },
      },
      include: USER_INCLUDE,
    });

    return students.map((student) => ({
      value: student.id,
      label: student.user.fullName,
    }));
  }

  async create(dto: CreateStudentDto) {
    await this.userService.checkEmailExists(dto.email);

    const hashedPassword = await hashPassword(dto.password);

    await this.prismaService.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,

          password: hashedPassword,

          fullName: dto.fullName,

          phone: dto.phone,

          address: dto.address,

          avatarUrl: dto.avatarUrl,

          gender: dto.gender,

          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,

          role: Role.STUDENT,

          student: {
            create: {
              studentCode: generateCode(Role.STUDENT),

              parentName: dto.parentName,
              parentPhone: dto.parentPhone,

              schoolName: dto.schoolName,
              grade: dto.grade,

              entryAcademicLevel: dto.entryAcademicLevel,

              latestTestScore: dto.latestTestScore,

              learningGoal: dto.learningGoal,

              note: dto.note,
            },
          },
        },
      });

      await tx.activityLog.create({
        data: {
          type: ActivityType.STUDENT_CREATED,
          title: 'Học viên mới',
          description: `${user.fullName} đã được thêm vào hệ thống`,
        },
      });
    });

    return CustomResponse(
      true,
      StatusCode.CREATED,
      'Tạo học viên thành công',
      null,
    );
  }

  async update(userId: string, dto: UpdateStudentDto) {
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

      this.prismaService.student.update({
        where: {
          userId,
        },

        data: {
          parentName: dto.parentName,

          parentPhone: dto.parentPhone,

          schoolName: dto.schoolName,

          grade: dto.grade,

          entryAcademicLevel: dto.entryAcademicLevel,

          latestTestScore: dto.latestTestScore,

          learningGoal: dto.learningGoal,

          note: dto.note,
        },
      }),
    ]);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Cập nhật thông tin học viên thành công',
      null,
    );
  }

  async findAll(query: StudentQueryDto) {
    const { page = 1, limit = 10, status, keySearch } = query;

    const skip = (page - 1) * limit;

    const userWhere: Prisma.UserWhereInput = {
      role: Role.STUDENT,
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

    const where: Prisma.StudentWhereInput = {
      user: userWhere,
    };

    const [students, total] = await Promise.all([
      this.prismaService.student.findMany({
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

      this.prismaService.student.count({
        where,
      }),
    ]);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy danh sách học viên thành công',
      {
        items: students.map(mapStudentResponse),

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
    const student = await this.getStudentByIdOrThrow(id);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy thông tin học viên thành công',
      mapStudentResponse(student),
    );
  }
}

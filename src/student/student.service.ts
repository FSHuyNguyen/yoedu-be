import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';

import { generateCode } from '../shared/utils/generate-code';
import { encrypt } from '../shared/utils/bcrypt';

import { UserService } from '../user/user.service';

import { mapStudentResponse, STUDENT_INCLUDE } from './mappers/student.mapper';
import { Prisma, Role, Status, StudentStatus } from '@prisma/client';
import { StudentQueryDto } from './dto/query-student.dto';
import { AuthUser } from '../auth/types/auth-jwt-user.type';

@Injectable()
export class StudentService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  async getStudentByIdOrThrow(studentId: string) {
    const student = await this.prismaService.student.findUnique({
      where: {
        id: studentId,
      },

      include: STUDENT_INCLUDE,
    });

    if (!student) {
      throw new NotFoundException('Không tìm thấy học viên');
    }

    return student;
  }

  async getStudentOptions() {
    const students = await this.prismaService.student.findMany({
      where: {
        status: StudentStatus.ACTIVE,
        user: {
          role: Role.STUDENT,
          status: Status.ACTIVE,
        },
      },
      include: STUDENT_INCLUDE,
    });

    return students.map((student) => ({
      value: student.id,
      label: student.user.fullName,
    }));
  }

  async create(dto: CreateStudentDto) {
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

        role: Role.STUDENT,

        student: {
          create: {
            studentCode: generateCode(Role.STUDENT),

            schoolName: dto.schoolName,

            gradeLevel: dto.gradeLevel,

            entryAcademicLevel: dto.entryAcademicLevel,

            latestTestScore: dto.latestTestScore,

            learningGoal: dto.learningGoal,

            note: dto.note,
          },
        },
      },
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
          schoolName: dto.schoolName,

          gradeLevel: dto.gradeLevel,

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

  async findAll(currentUser: AuthUser, query: StudentQueryDto) {
    const { page = 1, limit = 10, status, keySearch } = query;

    const skip = (page - 1) * limit;

    const userWhere: Prisma.UserWhereInput = {
      role: Role.STUDENT,
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

    const where: Prisma.StudentWhereInput = {
      user: userWhere,
      status: status || undefined,
    };

    /*************************************************************
     * PERMISSION
     *************************************************************/
    if (currentUser.role === Role.TEACHER) {
      if (!currentUser.teacherId) {
        throw new ForbiddenException('Tài khoản giáo viên không hợp lệ');
      }

      where.enrollments = {
        some: {
          courseClass: {
            OR: [
              {
                mainTeacherId: currentUser.teacherId,
              },
              {
                assistantTeacherId: currentUser.teacherId,
              },
            ],
          },
        },
      };
    }

    const [students, total] = await Promise.all([
      this.prismaService.student.findMany({
        where,

        skip,
        take: limit,

        include: STUDENT_INCLUDE,

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

  async active(studentId: string) {
    await this.getStudentByIdOrThrow(studentId);

    await this.prismaService.student.update({
      where: {
        id: studentId,
      },

      data: {
        status: StudentStatus.ACTIVE,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Thay đổi trạng thái thành công',
      null,
    );
  }

  async paused(studentId: string) {
    await this.getStudentByIdOrThrow(studentId);

    await this.prismaService.student.update({
      where: {
        id: studentId,
      },

      data: {
        status: StudentStatus.PAUSED,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Thay đổi trạng thái thành công',
      null,
    );
  }

  async remove(studentId: string) {
    await this.getStudentByIdOrThrow(studentId);

    await this.prismaService.student.update({
      where: {
        id: studentId,
      },

      data: {
        status: StudentStatus.DROPPED,
      },
    });

    return CustomResponse(true, StatusCode.OK, 'Học viên đã bị xóa', null);
  }
}

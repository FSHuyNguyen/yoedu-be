import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

import { CustomResponse } from '../../utils/response';
import { StatusCode } from '../../utils/status';

import { generateStudentCode } from '../../utils/generate-code';
import { hashPassword } from '../../utils/hash-password';

import { UserService } from '../user/user.service';

import { FiltersStudentDto } from './dto/filter-student.dto';
import { USER_SELECT } from '../user/constants/user.constants';
import { mapStudentResponse } from './mappers/student.mapper';

@Injectable()
export class StudentService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  async getStudentByIdOrThrow(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: {
        id: studentId,
      },
      include: {
        user: {
          select: USER_SELECT,
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Không tìm thấy học viên');
    }

    return student;
  }

  /*************************************************************
   * ADMIN
   *************************************************************/
  async create(dto: CreateStudentDto) {
    await this.userService.checkEmailExists(dto.email);

    const hashedPassword = await hashPassword(dto.password);

    await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        fullName: dto.fullName,
        phone: dto.phone,
        address: dto.address,

        role: 'STUDENT',

        student: {
          create: {
            studentCode: generateStudentCode(),

            parentName: dto.parentName,
            parentPhone: dto.parentPhone,

            entryAcademicLevel: dto.entryAcademicLevel,

            latestTestScore: dto.latestTestScore,
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

  async findAll(filters: FiltersStudentDto) {
    const { page = 1, limit = 10, keySearch } = filters;

    const skip = (page - 1) * limit;

    const where: any = {
      user: {
        role: 'STUDENT',
      },
    };

    if (keySearch) {
      where.user.OR = [
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

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        where,

        skip,
        take: limit,

        include: {
          user: {
            select: USER_SELECT,
          },
        },

        orderBy: {
          user: {
            createdAt: 'desc',
          },
        },
      }),

      this.prisma.student.count({
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

    if (!student) {
      throw new NotFoundException('Không tìm thấy học viên');
    }

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy thông tin học viên thành công',
      mapStudentResponse(student),
    );
  }

  async updateStudentByAdmin(userId: string, dto: UpdateStudentDto) {
    await this.userService.getUserByIdOrThrow(userId);

    await this.prisma.student.update({
      where: {
        userId,
      },

      data: {
        parentName: dto.parentName,
        parentPhone: dto.parentPhone,

        entryAcademicLevel: dto.entryAcademicLevel,

        latestTestScore: dto.latestTestScore,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Cập nhật thông tin học viên thành công',
      null,
    );
  }

  /*************************************************************
   * STUDENT
   *************************************************************/
  async updateMe(userId: string, dto: UpdateStudentDto) {
    await this.userService.getUserByIdOrThrow(userId);

    await this.prisma.student.update({
      where: {
        userId,
      },

      data: {
        parentName: dto.parentName,
        parentPhone: dto.parentPhone,

        entryAcademicLevel: dto.entryAcademicLevel,

        latestTestScore: dto.latestTestScore,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Cập nhật thông tin học viên thành công',
      null,
    );
  }
}

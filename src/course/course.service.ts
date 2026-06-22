import { Injectable, NotFoundException } from '@nestjs/common';

import { CourseStatus, Prisma, Course } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseQueryDto } from './dto/query-course.dto';

import { generateCode } from '../shared/utils/generate-code';

import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';
import { mapCourseResponse } from './mappers/course.mapper';

@Injectable()
export class CourseService {
  constructor(private readonly prismaService: PrismaService) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  async getCourseByIdOrThrow(courseId: string): Promise<Course> {
    const course = await this.prismaService.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      throw new NotFoundException('Không tìm thấy khóa học');
    }

    return course;
  }

  async getCourseOptions() {
    const courses = await this.prismaService.course.findMany({
      where: {
        status: CourseStatus.OPEN,
      },
    });

    return courses.map((course) => ({
      ...course,
      value: course.id,
      label: course.name,
    }));
  }

  async create(dto: CreateCourseDto) {
    await this.prismaService.course.create({
      data: {
        ...dto,
        courseCode: generateCode('C'),
      },
    });

    return CustomResponse(
      true,
      StatusCode.CREATED,
      'Tạo khóa học thành công',
      null,
    );
  }

  async findAll(query: CourseQueryDto) {
    const {
      page = 1,
      limit = 10,

      status,
      level,
      keySearch,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (level) {
      where.level = level;
    }

    if (keySearch) {
      where.OR = [
        {
          name: {
            contains: keySearch,
            mode: 'insensitive',
          },
        },

        {
          courseCode: {
            contains: keySearch,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [courses, total] = await Promise.all([
      this.prismaService.course.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prismaService.course.count({
        where,
      }),
    ]);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy danh sách khóa học thành công',
      {
        items: courses.map(mapCourseResponse),

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
    const course = await this.getCourseByIdOrThrow(id);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy thông tin khóa học thành công',
      mapCourseResponse(course),
    );
  }

  async update(id: string, dto: UpdateCourseDto) {
    await this.getCourseByIdOrThrow(id);

    await this.prismaService.course.update({
      where: {
        id,
      },

      data: {
        ...dto,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Cập nhật khóa học thành công',
      null,
    );
  }

  async openCourse(courseId: string) {
    await this.getCourseByIdOrThrow(courseId);

    await this.prismaService.course.update({
      where: {
        id: courseId,
      },

      data: {
        status: CourseStatus.OPEN,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Thay đổi trạng thái thành công',
      null,
    );
  }

  async closedCourse(courseId: string) {
    await this.getCourseByIdOrThrow(courseId);

    await this.prismaService.course.update({
      where: {
        id: courseId,
      },

      data: {
        status: CourseStatus.CLOSED,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Thay đổi trạng thái thành công',
      null,
    );
  }

  async remove(id: string) {
    await this.getCourseByIdOrThrow(id);

    await this.prismaService.course.update({
      where: {
        id,
      },

      data: {
        status: CourseStatus.DELETED,
      },
    });

    return CustomResponse(true, StatusCode.OK, 'Xóa khóa học thành công', null);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';

import { CourseStatus, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseQueryDto } from './dto/course-query.dto';

import { generateCode } from '../shared/utils/generate-code';

import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';
import { TeacherService } from '../teacher/teacher.service';
import { COURSE_INCLUDE, mapCourseResponse } from './mappers/course.mapper';

@Injectable()
export class CourseService {
  constructor(
    private readonly prismaService: PrismaService,
    private teacherService: TeacherService,
  ) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  public async getCourseByIdOrThrow(
    courseId: string,
  ): Promise<Prisma.CourseGetPayload<{ include: typeof COURSE_INCLUDE }>> {
    const course = await this.prismaService.course.findUnique({
      where: {
        id: courseId,
      },

      include: COURSE_INCLUDE,
    });

    if (!course) {
      throw new NotFoundException('Không tìm thấy khóa học');
    }

    console.log('course', course);

    return course;
  }

  async create(dto: CreateCourseDto) {
    if (dto.teacherId) {
      await this.teacherService.getTeacherByIdOrThrow(dto.teacherId);
    }

    await this.prismaService.course.create({
      data: {
        courseCode: generateCode('Course'),

        name: dto.name,

        description: dto.description,

        thumbnailUrl: dto.thumbnailUrl,

        level: dto.level,

        price: dto.price,

        totalSessions: dto.totalSessions,

        startDate: dto.startDate,

        endDate: dto.endDate,

        status: dto.status,

        teacherId: dto.teacherId,
      },

      include: COURSE_INCLUDE,
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
      teacherId,
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

    if (teacherId) {
      where.teacherId = teacherId;
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

        include: COURSE_INCLUDE,
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
      'Lấy thông tin giáo viên thành công',
      mapCourseResponse(course),
    );
  }

  async update(id: string, dto: UpdateCourseDto) {
    await this.getCourseByIdOrThrow(id);

    if (dto.teacherId) {
      await this.teacherService.getTeacherByIdOrThrow(dto.teacherId);
    }

    await this.prismaService.course.update({
      where: {
        id,
      },

      data: {
        ...dto,
      },

      include: COURSE_INCLUDE,
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Cập nhật khóa học thành công',
      null,
    );
  }

  async changeStatus(courseId: string) {
    const course = await this.getCourseByIdOrThrow(courseId);

    const newStatus =
      course.status === CourseStatus.DRAFT
        ? CourseStatus.OPEN
        : course.status === CourseStatus.OPEN
          ? CourseStatus.CLOSED
          : CourseStatus.OPEN;

    await this.prismaService.course.update({
      where: {
        id: courseId,
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

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { Role } from '@prisma/client';

import { CourseService } from './course.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseQueryDto } from './dto/course-query.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Tạo khóa học',
  })
  async create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Lấy danh sách khóa học',
  })
  async findAll(@Query() query: CourseQueryDto) {
    return this.courseService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Lấy chi tiết khóa học',
  })
  async findById(@Param('id') id: string) {
    return this.courseService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Cập nhật khóa học',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.update(id, dto);
  }

  // PATCH /courses/:id/change-status
  @Patch(':id/change-status')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Thay đổi trạng thái khóa học',
  })
  async changeStatus(@Param('id') id: string) {
    return this.courseService.changeStatus(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Xóa khóa học',
  })
  async remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}

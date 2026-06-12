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
import { CourseQueryDto } from './dto/query-course.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('options')
  getCourseOptions() {
    return this.courseService.getCourseOptions();
  }

  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Tạo khóa học',
  })
  async create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Lấy danh sách khóa học',
  })
  async findAll(@Query() query: CourseQueryDto) {
    return this.courseService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Lấy chi tiết khóa học',
  })
  async findById(@Param('id') id: string) {
    return this.courseService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Cập nhật khóa học',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.update(id, dto);
  }

  @Patch(':id/open')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Mở khóa học',
  })
  async openCourse(@Param('id') id: string) {
    return this.courseService.openCourse(id);
  }

  @Patch(':id/close')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Đóng khóa học',
  })
  async closedCourse(@Param('id') id: string) {
    return this.courseService.closedCourse(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Xóa khóa học',
  })
  async remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}

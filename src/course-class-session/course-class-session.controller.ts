import { Controller, Get, Body, Patch, Param, Query } from '@nestjs/common';
import { CourseClassSessionService } from './course-class-session.service';
import { UpdateCourseClassSessionDto } from './dto/update-course-class-session.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiOperation } from '@nestjs/swagger';
import { CourseClassSessionQueryDto } from './dto/query-create-course-class-session.dto';

@Controller('course-class-session')
export class CourseClassSessionController {
  constructor(
    private readonly courseClassSessionService: CourseClassSessionService,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.STAFF, Role.TEACHER)
  @ApiOperation({
    summary: 'Lấy danh sách lớp học',
  })
  async findAll(@Query() query: CourseClassSessionQueryDto) {
    return this.courseClassSessionService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF, Role.TEACHER)
  @ApiOperation({
    summary: 'Lấy chi tiết lớp học',
  })
  async findById(@Param('id') id: string) {
    return this.courseClassSessionService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Cập nhật lớp học',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCourseClassSessionDto,
  ) {
    return this.courseClassSessionService.update(id, dto);
  }
}

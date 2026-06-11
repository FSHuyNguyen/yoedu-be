import { Controller, Get, Body, Param, Query, Patch } from '@nestjs/common';
import { CourseClassSessionService } from './course-class-session.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiOperation } from '@nestjs/swagger';
import { CourseClassSessionQueryDto } from './dto/query-create-course-class-session.dto';
import { CourseClassSessionCalendarQueryDto } from './dto/query-calendar-course-class-session.dto';

@Controller('course-class-sessions')
export class CourseClassSessionController {
  constructor(
    private readonly courseClassSessionService: CourseClassSessionService,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Lấy danh sách lớp học',
  })
  async findAll(@Query() query: CourseClassSessionQueryDto) {
    return this.courseClassSessionService.findAll(query);
  }

  @Get('calendar')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Lấy dữ liệu lịch học dạng calendar',
  })
  async calendar(@Query() query: CourseClassSessionCalendarQueryDto) {
    return this.courseClassSessionService.calendar(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Lấy chi tiết lớp học',
  })
  async findById(@Param('id') id: string) {
    return this.courseClassSessionService.findById(id);
  }

  @Patch(':id/done')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Đánh dấu ca học hoàn thành',
  })
  async markAsDone(@Param('id') id: string) {
    return this.courseClassSessionService.markAsDone(id);
  }

  @Patch(':id/cancel')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Hủy ca học',
  })
  async cancel(@Param('id') id: string) {
    return this.courseClassSessionService.cancel(id);
  }

  // @Patch(':id/rescheduled')
  // @Roles(Role.ADMIN, Role.STAFF)
  // @ApiOperation({
  //   summary: 'Đặt lại ca học',
  // })
  // async reschedule(@Param('id') id: string) {
  //   return this.courseClassSessionService.reschedule(id);
  // }
}

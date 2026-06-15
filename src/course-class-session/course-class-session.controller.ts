import {
  Controller,
  Get,
  Body,
  Param,
  Query,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CourseClassSessionService } from './course-class-session.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CourseClassSessionQueryDto } from './dto/query-create-course-class-session.dto';
import { CourseClassSessionCalendarQueryDto } from './dto/query-calendar-course-class-session.dto';
import { TakeAttendanceDto } from './dto/take-attendance.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthUser } from '../auth/types/auth-jwt-user.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('course-class-sessions')
export class CourseClassSessionController {
  constructor(
    private readonly courseClassSessionService: CourseClassSessionService,
  ) {}

  @Get('options')
  getCourseClassSessionOptions() {
    return this.courseClassSessionService.getCourseClassSessionOptions();
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách ca học',
  })
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: CourseClassSessionQueryDto,
  ) {
    return this.courseClassSessionService.findAll(user, query);
  }

  @Get('calendar')
  @ApiOperation({
    summary: 'Lấy dữ liệu lịch học dạng calendar',
  })
  async calendar(
    @CurrentUser() user: AuthUser,
    @Query() query: CourseClassSessionCalendarQueryDto,
  ) {
    return this.courseClassSessionService.calendar(user, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chi tiết ca học',
  })
  async findById(@Param('id') id: string) {
    return this.courseClassSessionService.findById(id);
  }

  @Patch(':id/done')
  @Roles(Role.ADMIN, Role.STAFF, Role.TEACHER)
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

  @Get(':id/attendance')
  @ApiOperation({
    summary: 'Lấy danh sách điểm danh của ca học',
  })
  async attendance(@Param('id') id: string) {
    return this.courseClassSessionService.attendance(id);
  }

  @Post(':id/attendance')
  @Roles(Role.ADMIN, Role.STAFF, Role.TEACHER)
  @ApiOperation({
    summary: 'Điểm danh ca học',
  })
  async takeAttendance(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: TakeAttendanceDto,
  ) {
    return this.courseClassSessionService.takeAttendance(user.id, id, dto);
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

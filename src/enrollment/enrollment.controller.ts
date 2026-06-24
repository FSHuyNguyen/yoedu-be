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

import { EnrollmentService } from './enrollment.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { EnrollmentQueryDto } from './dto/query-enrollment.dto';
import type { AuthUser } from '../auth/types/auth-jwt-user.type';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Đăng ký học viên vào khóa học',
  })
  create(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách đăng ký khóa học',
  })
  findAll(@CurrentUser() user: AuthUser, @Query() query: EnrollmentQueryDto) {
    return this.enrollmentService.findAll(user, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chi tiết đăng ký khóa học',
  })
  findById(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.enrollmentService.findById(user, id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Cập nhật đăng ký khóa học',
  })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentService.update(user, id, dto);
  }

  @Patch(':id/pause')
  @ApiOperation({
    summary: 'Tạm dừng đăng ký khóa học',
  })
  pause(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.enrollmentService.pause(user, id);
  }

  @Patch(':id/active')
  @ApiOperation({
    summary: 'Kích hoạt đăng ký khóa học',
  })
  active(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.enrollmentService.active(user, id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Hủy đăng ký khóa học',
  })
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.enrollmentService.remove(user, id);
  }
}

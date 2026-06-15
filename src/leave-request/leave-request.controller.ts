import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LeaveRequestService } from './leave-request.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { LeaveRequestQueryDto } from './dto/query-create-leave-request.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/types/auth-jwt-user.type';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leave-requests')
export class LeaveRequestController {
  constructor(private readonly leaveRequestService: LeaveRequestService) {}

  // ==========================
  // Student
  // ==========================
  @Post('me')
  @Roles(Role.STUDENT)
  @ApiOperation({
    summary: 'Tạo đơn xin nghỉ học',
  })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateLeaveRequestDto) {
    return this.leaveRequestService.create(user, dto);
  }

  @Patch('me/:id')
  @Roles(Role.STUDENT)
  @ApiOperation({
    summary: 'Cập nhật đơn xin nghỉ học',
  })
  update(@Param('id') id: string, @Body() dto: UpdateLeaveRequestDto) {
    return this.leaveRequestService.update(id, dto);
  }

  @Get('me')
  @Roles(Role.STUDENT)
  @ApiOperation({
    summary: 'Lấy danh sách đơn xin nghỉ của bản thân',
  })
  findAllMe(
    @CurrentUser() user: AuthUser,
    @Query() query: LeaveRequestQueryDto,
  ) {
    return this.leaveRequestService.findAllMe(user, query);
  }

  @Delete('me/:id')
  @Roles(Role.STUDENT)
  @ApiOperation({
    summary: 'Xóa đơn xin nghỉ của bản thân theo ID',
  })
  remove(@Param('id') id: string) {
    return this.leaveRequestService.remove(id);
  }

  // ==========================
  // Admin / Staff
  // ==========================
  @Get()
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Lấy danh sách đơn xin nghỉ của tất cả học sinh',
  })
  findAll(@Query() query: LeaveRequestQueryDto) {
    return this.leaveRequestService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Lấy chi tiết đơn xin nghỉ của học sinh',
  })
  findById(@Param('id') id: string) {
    return this.leaveRequestService.findById(id);
  }

  @Patch(':id/approve')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Phê duyệt đơn xin nghỉ của học sinh',
  })
  approve(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.leaveRequestService.approve(user, id);
  }

  @Patch(':id/reject')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Từ chối đơn xin nghỉ của học sinh',
  })
  reject(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.leaveRequestService.reject(user, id);
  }
}

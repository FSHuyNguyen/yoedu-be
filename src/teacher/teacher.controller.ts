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

import { TeacherService } from './teacher.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { TeacherQueryDto } from './dto/query-teacher.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { AuthUser } from '../auth/types/auth-jwt-user.type';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('options')
  getTeacherOptions() {
    return this.teacherService.getTeacherOptions();
  }

  @Patch('me')
  @Roles(Role.TEACHER)
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateTeacherDto) {
    return this.teacherService.update(user.id, dto);
  }

  // POST /teachers
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateTeacherDto) {
    return this.teacherService.create(dto);
  }

  // GET /teachers?page=1&limit=10&keySearch=huy
  @Roles(Role.ADMIN, Role.STAFF)
  @Get()
  findAll(@Query() query: TeacherQueryDto) {
    return this.teacherService.findAll(query);
  }

  // GET /teachers/:id
  @Roles(Role.ADMIN, Role.STAFF)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.teacherService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateTeacherDto) {
    return this.teacherService.update(id, dto);
  }

  @Patch(':id/active')
  @Roles(Role.ADMIN)
  active(@Param('id') id: string) {
    return this.teacherService.active(id);
  }

  @Patch(':id/paused')
  @Roles(Role.ADMIN)
  paused(@Param('id') id: string) {
    return this.teacherService.paused(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.teacherService.remove(id);
  }
}

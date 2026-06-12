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

import { StudentService } from './student.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentQueryDto } from './dto/query-student.dto';
import { Role } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { AuthUser } from '../auth/types/auth-jwt-user.type';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('options')
  getStudentOptions() {
    return this.studentService.getStudentOptions();
  }

  @Patch('me')
  @Roles(Role.STUDENT)
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateStudentDto) {
    return this.studentService.update(user.id, dto);
  }

  // POST /students
  @Roles(Role.ADMIN, Role.STAFF)
  @Post()
  create(@Body() dto: CreateStudentDto) {
    return this.studentService.create(dto);
  }

  // GET /students?page=1&limit=10&keySearch=huy
  @Roles(Role.ADMIN, Role.STAFF, Role.TEACHER)
  @Get()
  findAll(@CurrentUser() user: AuthUser, @Query() query: StudentQueryDto) {
    return this.studentService.findAll(user, query);
  }

  // GET /students/:id
  @Roles(Role.ADMIN, Role.STAFF, Role.TEACHER)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.studentService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentService.update(id, dto);
  }

  @Patch(':id/active')
  @Roles(Role.ADMIN, Role.STAFF)
  active(@Param('id') id: string) {
    return this.studentService.active(id);
  }

  @Patch(':id/paused')
  @Roles(Role.ADMIN, Role.STAFF)
  paused(@Param('id') id: string) {
    return this.studentService.paused(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}

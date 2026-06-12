import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { CourseClassService } from './course-class.service';
import { CreateCourseClassDto } from './dto/create-course-class.dto';
import { UpdateCourseClassDto } from './dto/update-course-class.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CourseClassQueryDto } from './dto/query-course-class.dto';
import type { AuthUser } from '../auth/types/auth-jwt-user.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('course-class')
export class CourseClassController {
  constructor(private readonly courseClassService: CourseClassService) {}

  @Get('options')
  getCourseClassOptions() {
    return this.courseClassService.getCourseClassOptions();
  }

  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Tạo lớp học',
  })
  async create(@Body() dto: CreateCourseClassDto) {
    return this.courseClassService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách lớp học',
  })
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: CourseClassQueryDto,
  ) {
    return this.courseClassService.findAll(user, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chi tiết lớp học',
  })
  async findById(@Param('id') id: string) {
    return this.courseClassService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Cập nhật lớp học',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateCourseClassDto) {
    return this.courseClassService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Xóa lớp học',
  })
  async remove(@Param('id') id: string) {
    return this.courseClassService.remove(id);
  }
}

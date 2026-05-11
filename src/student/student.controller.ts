import {
  Body,
  Controller,
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
import { FiltersStudentDto } from './dto/filter-student.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  /*************************************************************
   * ROLE STUDENT
   *************************************************************/
  @Patch('me')
  @Roles('STUDENT')
  updateMe(
    @CurrentUser() user: any,
    @Body()
    dto: UpdateStudentDto,
  ) {
    return this.studentService.updateMe(user.id, dto);
  }

  /*************************************************************
   * ROLE ADMIN
   *************************************************************/
  // POST /students
  @Roles('ADMIN')
  @Post()
  create(
    @Body()
    dto: CreateStudentDto,
  ) {
    return this.studentService.create(dto);
  }

  // GET /students?page=1&limit=10&keySearch=huy
  @Roles('ADMIN')
  @Get()
  findAll(@Query() filters: FiltersStudentDto) {
    return this.studentService.findAll(filters);
  }

  // GET /students/:id
  @Roles('ADMIN')
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.studentService.findById(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  updateStudentByAdmin(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentService.updateStudentByAdmin(id, dto);
  }
}

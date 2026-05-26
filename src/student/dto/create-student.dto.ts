import { IntersectionType } from '@nestjs/swagger';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { BaseStudentDto } from './base-student.dto';

export class CreateStudentDto extends IntersectionType(
  CreateUserDto,
  BaseStudentDto,
) {}

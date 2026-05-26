import { IntersectionType } from '@nestjs/swagger';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { BaseTeacherDto } from './base-teacher.dto';

export class CreateTeacherDto extends IntersectionType(
  CreateUserDto,
  BaseTeacherDto,
) {}

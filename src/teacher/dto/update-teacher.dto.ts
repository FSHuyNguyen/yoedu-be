import { IntersectionType } from '@nestjs/swagger';
import { UpdateUserDto } from '../../user/dto/update-user.dto';
import { BaseTeacherDto } from './base-teacher.dto';

export class UpdateTeacherDto extends IntersectionType(
  UpdateUserDto,
  BaseTeacherDto,
) {}

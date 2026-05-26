import { IntersectionType } from '@nestjs/swagger';
import { UpdateUserDto } from '../../user/dto/update-user.dto';
import { BaseStudentDto } from './base-student.dto';

export class UpdateStudentDto extends IntersectionType(
  UpdateUserDto,
  BaseStudentDto,
) {}

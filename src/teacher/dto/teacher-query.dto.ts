import { IntersectionType } from '@nestjs/mapped-types';

import { PaginationDto } from '../../shared/dto/pagination.dto';
import { TeacherFilterDto } from './filter-teacher.dto';

export class TeacherQueryDto extends IntersectionType(
  PaginationDto,
  TeacherFilterDto,
) {}

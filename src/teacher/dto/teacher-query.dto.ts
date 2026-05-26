import { IntersectionType } from '@nestjs/swagger';

import { PaginationDto } from '../../shared/dto/pagination.dto';
import { TeacherFilterDto } from './filter-teacher.dto';

export class TeacherQueryDto extends IntersectionType(
  PaginationDto,
  TeacherFilterDto,
) {}

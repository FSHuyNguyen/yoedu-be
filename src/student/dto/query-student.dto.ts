import { IntersectionType } from '@nestjs/swagger';

import { PaginationDto } from '../../shared/dto/pagination.dto';
import { StudentFilterDto } from './filter-student.dto';

export class StudentQueryDto extends IntersectionType(
  PaginationDto,
  StudentFilterDto,
) {}

import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { FilterEnrollmentDto } from './filter-enrollment.dto';

export class EnrollmentQueryDto extends IntersectionType(
  PaginationDto,
  FilterEnrollmentDto,
) {}

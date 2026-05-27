import { IntersectionType } from '@nestjs/swagger';

import { PaginationDto } from '../../shared/dto/pagination.dto';

import { FilterCourseDto } from './filter-course.dto';

export class CourseQueryDto extends IntersectionType(
  PaginationDto,
  FilterCourseDto,
) {}

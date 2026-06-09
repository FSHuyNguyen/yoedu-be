import { IntersectionType } from '@nestjs/swagger';

import { PaginationDto } from '../../shared/dto/pagination.dto';

import { FilterCourseClassDto } from './filter-course-class.dto';

export class CourseClassQueryDto extends IntersectionType(
  PaginationDto,
  FilterCourseClassDto,
) {}

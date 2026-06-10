import { IntersectionType } from '@nestjs/swagger';

import { PaginationDto } from '../../shared/dto/pagination.dto';
import { FilterCourseClassSessionDto } from './filter-create-course-class-session.dto';

export class CourseClassSessionQueryDto extends IntersectionType(
  PaginationDto,
  FilterCourseClassSessionDto,
) {}

import { IntersectionType } from '@nestjs/swagger';

import { PaginationDto } from '../../shared/dto/pagination.dto';
import { FilterScheduleDto } from './filter-schedule.dto';

export class ScheduleQueryDto extends IntersectionType(
  PaginationDto,
  FilterScheduleDto,
) {}

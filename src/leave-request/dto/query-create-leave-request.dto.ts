import { IntersectionType } from '@nestjs/swagger';

import { PaginationDto } from '../../shared/dto/pagination.dto';
import { FilterLeaveRequestDto } from './filter-create-leave-request.dto';

export class LeaveRequestQueryDto extends IntersectionType(
  PaginationDto,
  FilterLeaveRequestDto,
) {}

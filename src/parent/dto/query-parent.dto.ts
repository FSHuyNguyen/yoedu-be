import { IntersectionType } from '@nestjs/swagger';

import { PaginationDto } from '../../shared/dto/pagination.dto';
import { ParentFilterDto } from './filter-parent.dto';

export class ParentQueryDto extends IntersectionType(
  PaginationDto,
  ParentFilterDto,
) {}

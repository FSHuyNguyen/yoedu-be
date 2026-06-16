import { IntersectionType } from '@nestjs/swagger';

import { PaginationDto } from '../../shared/dto/pagination.dto';
import { FilterPromotionDto } from './filter-create-promotion.dto';

export class PromotionQueryDto extends IntersectionType(
  PaginationDto,
  FilterPromotionDto,
) {}

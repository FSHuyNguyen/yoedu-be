import { IntersectionType } from '@nestjs/mapped-types';

import { UserFilterDto } from './user-filter.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';

export class UserQueryDto extends IntersectionType(
  PaginationDto,
  UserFilterDto,
) {}

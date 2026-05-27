import { IntersectionType } from '@nestjs/swagger';

import { UserFilterDto } from './filter-user.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';

export class UserQueryDto extends IntersectionType(
  PaginationDto,
  UserFilterDto,
) {}

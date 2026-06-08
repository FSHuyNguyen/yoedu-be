import { IntersectionType } from '@nestjs/swagger';

import { PaginationDto } from '../../shared/dto/pagination.dto';
import { FilterRoomDto } from './filter-room.dto';

export class RoomQueryDto extends IntersectionType(
  PaginationDto,
  FilterRoomDto,
) {}

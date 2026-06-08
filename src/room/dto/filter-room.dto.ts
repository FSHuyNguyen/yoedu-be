import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

export class FilterRoomDto {
  @ApiPropertyOptional({
    example: '',
    description: 'Từ khóa tìm kiếm',
  })
  @IsOptional()
  @IsString()
  keySearch?: string;
}

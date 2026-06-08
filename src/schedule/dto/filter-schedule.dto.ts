import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterScheduleDto {
  @ApiPropertyOptional({
    example: 2,
    description:
      'Ngày trong tuần (2: Monday, 3: Tuesday, 4: Wednesday, 5: Thursday, 6: Friday, 7: Saturday, 8: Sunday)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weekday?: number;

  @ApiPropertyOptional({
    example: '08:00',
    description: 'Thời gian bắt đầu của lịch học (định dạng HH:mm)',
  })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({
    example: '10:00',
    description: 'Thời gian kết thúc của lịch học (định dạng HH:mm)',
  })
  @IsOptional()
  @IsString()
  endTime?: string;
}

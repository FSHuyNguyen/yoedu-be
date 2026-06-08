import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseScheduleDto {
  @ApiProperty({
    example: 2,
    description:
      'Ngày trong tuần (2: Monday, 3: Tuesday, 4: Wednesday, 5: Thursday, 6: Friday, 7: Saturday, 8: Sunday)',
  })
  @Type(() => Number)
  @IsNumber()
  weekday!: number;

  @ApiProperty({
    example: '08:00',
    description: 'Thời gian bắt đầu của lịch học (định dạng HH:mm)',
  })
  @IsString()
  startTime!: string;

  @ApiProperty({
    example: '10:00',
    description: 'Thời gian kết thúc của lịch học (định dạng HH:mm)',
  })
  @IsString()
  endTime!: string;

  @ApiPropertyOptional({
    example: 'Lớp học vào buổi sáng',
    description: 'Ghi chú về lịch học',
  })
  @IsOptional()
  @IsString()
  note?: string;
}

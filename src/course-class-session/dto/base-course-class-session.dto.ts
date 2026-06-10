import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class BaseCourseClassSessionDto {
  @ApiProperty({
    example: null,
    description: 'ID của lớp học',
  })
  @IsString()
  courseClassId!: string;

  @ApiProperty({
    example: null,
    description: 'ID của ca học',
  })
  @IsString()
  scheduleSlotId!: string;

  @ApiProperty({
    example: '2024-09-01T08:00:00Z',
    description: 'Thời gian bắt đầu lớp học',
  })
  @IsString()
  startTime!: string;

  @ApiProperty({
    example: '2024-09-01T10:00:00Z',
    description: 'Thời gian kết thúc lớp học',
  })
  @IsString()
  endTime!: string;

  @ApiPropertyOptional({
    example: 'Đã đóng học phí đợt 1',
    description: 'Ghi chú',
  })
  @IsOptional()
  @IsString()
  note?: string;
}

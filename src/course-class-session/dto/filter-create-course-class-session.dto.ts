import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

export class FilterCourseClassSessionDto {
  @ApiPropertyOptional({
    example: null,
    description: 'ID khóa học',
  })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'ID lớp học',
  })
  @IsOptional()
  @IsString()
  courseClassId?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'ID giáo viên chính',
  })
  @IsOptional()
  @IsString()
  mainTeacherId?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'ID ca học',
  })
  @IsOptional()
  @IsString()
  scheduleSlotId?: string;

  @ApiPropertyOptional({
    example: '2024-09-01T08:00:00Z',
    description: 'Thời gian bắt đầu lớp học',
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2024-09-01T10:00:00Z',
    description: 'Thời gian kết thúc lớp học',
  })
  @IsOptional()
  @IsString()
  endDate?: string;
}

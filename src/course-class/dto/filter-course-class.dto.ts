import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

export class FilterCourseClassDto {
  @ApiPropertyOptional({
    example: null,
    description: 'ID khóa học',
  })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'ID phòng học',
  })
  @IsOptional()
  @IsString()
  roomId?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'ID ca học',
  })
  @IsOptional()
  @IsString()
  scheduleSlotId?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'ID giáo viên chính',
  })
  @IsOptional()
  @IsString()
  mainTeacherId?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Ngày bắt đầu lớp học',
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Ngày kết thúc lớp học',
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Từ khóa tìm kiếm',
  })
  @IsOptional()
  @IsString()
  keySearch?: string;
}

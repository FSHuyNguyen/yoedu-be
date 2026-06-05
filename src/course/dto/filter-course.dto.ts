import { ApiPropertyOptional } from '@nestjs/swagger';

import { CourseLevel, CourseStatus } from '@prisma/client';

import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterCourseDto {
  @ApiPropertyOptional({
    enum: CourseStatus,
    example: CourseStatus.OPEN,
    description: 'Trạng thái khóa học',
  })
  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @ApiPropertyOptional({
    enum: CourseLevel,
    example: CourseLevel.BEGINNER,
    description: 'Trình độ khóa học',
  })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiPropertyOptional({
    example: '',
    description: 'Từ khóa tìm kiếm',
  })
  @IsOptional()
  @IsString()
  keySearch?: string;
}

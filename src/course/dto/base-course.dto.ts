import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CourseLevel, CourseStatus } from '@prisma/client';

import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { Type } from 'class-transformer';

export class BaseCourseDto {
  @ApiProperty({
    example: 'IELTS Foundation 6.5',
    description: 'Tên khóa học',
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    example: 'Khóa học dành cho người mất gốc IELTS',
    description: 'Mô tả khóa học',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.yoedu.vn/course-thumbnail.jpg',
    description: 'Thumbnail khóa học',
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    enum: CourseLevel,
    example: CourseLevel.BEGINNER,
    description: 'Trình độ khóa học',
  })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiPropertyOptional({
    example: 5000000,
    description: 'Học phí khóa học',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    example: 24,
    description: 'Tổng số buổi học',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalSessions?: number;

  @ApiPropertyOptional({
    example: '2026-06-01T00:00:00.000Z',
    description: 'Ngày bắt đầu khóa học',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2026-08-30T00:00:00.000Z',
    description: 'Ngày kết thúc khóa học',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    enum: CourseStatus,
    example: CourseStatus.DRAFT,
    description: 'Trạng thái khóa học',
  })
  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @ApiPropertyOptional({
    example: 'teacher-id',
    description: 'ID giáo viên phụ trách',
  })
  @IsOptional()
  @IsString()
  teacherId?: string;
}

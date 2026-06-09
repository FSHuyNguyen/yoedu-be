import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
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
    description: 'Ảnh đại diện khóa học',
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
    example: 24,
    description: 'Tổng số buổi học',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalSessions?: number;
}

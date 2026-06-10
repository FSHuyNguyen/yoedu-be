import { ApiPropertyOptional } from '@nestjs/swagger';
import { EnrollmentStatus } from '@prisma/client';

import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterEnrollmentDto {
  @ApiPropertyOptional({
    enum: EnrollmentStatus,
    example: EnrollmentStatus.ACTIVE,
    description: 'Trạng thái đăng ký',
  })
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;

  @ApiPropertyOptional({
    example: '',
    description: 'Lọc theo học viên',
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Lọc theo lớp học',
  })
  @IsOptional()
  @IsString()
  courseClassId?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Lọc theo khóa học',
  })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Từ khóa tìm kiếm',
  })
  @IsOptional()
  @IsString()
  keySearch?: string;
}

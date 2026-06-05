import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EnrollmentStatus } from '@prisma/client';
import { Type } from 'class-transformer';

import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class BaseEnrollmentDto {
  @ApiProperty({
    example: null,
    description: 'ID học viên',
  })
  @IsString()
  studentId!: string;

  @ApiProperty({
    example: null,
    description: 'ID khóa học',
  })
  @IsString()
  courseId!: string;

  @ApiPropertyOptional({
    example: 3000000,
    description: 'Số tiền đã thanh toán',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  paidAmount?: number;

  @ApiPropertyOptional({
    example: 'Đã đóng học phí đợt 1',
    description: 'Ghi chú',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    enum: EnrollmentStatus,
    example: EnrollmentStatus.ACTIVE,
    description: 'Trạng thái đăng ký',
  })
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;
}

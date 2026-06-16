import { ApiPropertyOptional } from '@nestjs/swagger';
import { InvoiceStatus } from '@prisma/client';

import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterTuitionInvoiceDto {
  @ApiPropertyOptional({
    example: InvoiceStatus.PAID,
    enum: InvoiceStatus,
  })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @ApiPropertyOptional({
    example: null,
    description: 'Lọc theo học viên',
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'Lọc theo lớp học',
  })
  @IsOptional()
  @IsString()
  courseClassId?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'Lọc theo chương trình khuyến mãi',
  })
  @IsOptional()
  @IsString()
  promotionId?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'Lọc theo ngày đến hạn từ',
  })
  @IsOptional()
  @IsString()
  dueDateFrom?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'Lọc theo ngày đến hạn đến',
  })
  @IsOptional()
  @IsString()
  dueDateTo?: string;
}

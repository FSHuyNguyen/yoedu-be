import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterPaymentDto {
  @ApiPropertyOptional({
    example: PaymentStatus.SUCCESS,
    enum: PaymentStatus,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({
    example: PaymentMethod.CASH,
    enum: PaymentMethod,
    description: 'Lọc theo phương thức thanh toán',
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({
    example: null,
    description: 'Lọc theo ID hóa đơn thanh toán',
  })
  @IsOptional()
  @IsUUID()
  invoiceId?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'Lọc theo ngày thanh toán',
  })
  @IsOptional()
  @IsString()
  paidAtFrom?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'Lọc theo ngày thanh toán đến',
  })
  @IsOptional()
  @IsString()
  paidAtTo?: string;
}

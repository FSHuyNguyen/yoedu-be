import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class BasePaymentDto {
  @ApiProperty({
    example: null,
    description: 'ID hóa đơn thanh toán',
  })
  @IsUUID()
  invoiceId!: string;

  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.CASH,
    description:
      'Phương thức thanh toán (Chuyển khoản, Tiền mặt, Thẻ tín dụng, v.v.)',
  })
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @ApiProperty({
    example: 8.5,
    description: 'Số tiền đã thanh toán',
  })
  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
    {
      message: 'paidAmount chỉ được tối đa 2 chữ số thập phân',
    },
  )
  @IsPositive()
  paidAmount!: number;

  @IsOptional()
  @IsString()
  note?: string;
}

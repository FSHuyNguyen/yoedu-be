import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { DiscountType } from '@prisma/client';

export class BasePromotionDto {
  @ApiProperty({
    example: 'Khuyến mãi hè 2026',
    description: 'Tên chương trình khuyến mãi',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    enum: DiscountType,
    example: DiscountType.PERCENT,
    description: 'Loại giảm giá',
  })
  @IsEnum(DiscountType)
  discountType!: DiscountType;

  @ApiProperty({
    example: 10,
    description: 'Giá trị giảm giá',
  })
  @IsNumber()
  discountValue!: number;

  @ApiProperty({
    example: '2026-06-01T00:00:00.000Z',
    description: 'Ngày bắt đầu',
  })
  @IsDateString()
  startDate!: string;

  @ApiProperty({
    example: '2026-06-30T23:59:59.999Z',
    description: 'Ngày kết thúc',
  })
  @IsDateString()
  endDate!: string;

  @ApiProperty({
    example: 'Áp dụng cho học viên đăng ký mới',
    description: 'Ghi chú',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}

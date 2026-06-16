import { ApiPropertyOptional } from '@nestjs/swagger';
import { DiscountType, PromotionStatus } from '@prisma/client';

import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterPromotionDto {
  @ApiPropertyOptional({
    example: null,
    description: 'Loại khuyến mãi',
  })
  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @ApiPropertyOptional({
    example: '',
    description: 'Từ ngày',
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '',
    description: 'Đến ngày',
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

  @ApiPropertyOptional({
    enum: PromotionStatus,
    example: PromotionStatus.ACTIVE,
    description: 'Trạng thái chương trình khuyến mãi',
  })
  @IsOptional()
  @IsEnum(PromotionStatus)
  status?: PromotionStatus;
}

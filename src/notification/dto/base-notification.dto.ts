import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class BaseNotificationDto {
  @ApiProperty({
    example: null,
    description: 'ID người nhận thông báo',
  })
  @IsUUID()
  userId!: string;

  @ApiProperty({
    enum: NotificationType,
    example: NotificationType.TUITION,
    description: 'Loại thông báo',
  })
  @IsEnum(NotificationType)
  type!: NotificationType;

  @ApiProperty({
    example: 'Thanh toán học phí thành công',
    description: 'Tiêu đề thông báo',
  })
  @IsString()
  @MaxLength(150)
  title!: string;

  @ApiProperty({
    example: 'Bạn đã thanh toán học phí thành công.',
    description: 'Nội dung thông báo',
  })
  @IsString()
  @MaxLength(500)
  content!: string;

  @ApiPropertyOptional({
    example: 'payment',
    description: 'Loại entity liên quan',
  })
  @IsOptional()
  @IsString()
  relatedEntityType?: string;

  @ApiPropertyOptional({
    example: 'a6ec6cf4-7756-42d3-83f3-c58e52377f9d',
    description: 'ID entity liên quan',
  })
  @IsOptional()
  @IsUUID()
  relatedEntityId?: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseRoomDto {
  @ApiProperty({
    example: 'Phòng học IELTS Foundation 6.5',
    description: 'Tên phòng học',
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    example: 25,
    description: 'Sức chứa tối đa của phòng học',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  capacity!: number;

  @ApiPropertyOptional({
    example: 'Phòng học dành cho người mất gốc IELTS',
    description: 'Mô tả phòng học',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

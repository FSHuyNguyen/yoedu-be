import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class BaseTuitionInvoiceDto {
  @ApiProperty({
    example: null,
    description: 'ID học viên',
  })
  @IsUUID()
  studentId!: string;

  @ApiProperty({
    example: null,
    description: 'ID lớp học',
  })
  @IsUUID()
  courseClassId!: string;

  @ApiPropertyOptional({
    example: null,
    description: 'ID khuyến mãi áp dụng cho hóa đơn này',
  })
  @IsOptional()
  @IsString()
  promotionId?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

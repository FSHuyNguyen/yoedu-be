import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ParentFilterDto {
  @ApiPropertyOptional({
    example: '',
    description: 'Từ khóa tìm kiếm theo tên, email',
  })
  @IsOptional()
  @IsString()
  keySearch?: string;
}

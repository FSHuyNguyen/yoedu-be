import { ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class StudentFilterDto {
  @ApiPropertyOptional({
    enum: Status,
    example: Status.ACTIVE,
    description: 'Trạng thái học viên',
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({
    example: '',
    description: 'Từ khóa tìm kiếm theo tên, email hoặc số điện thoại',
  })
  @IsOptional()
  @IsString()
  keySearch?: string;
}

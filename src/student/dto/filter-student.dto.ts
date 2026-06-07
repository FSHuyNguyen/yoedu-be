import { ApiPropertyOptional } from '@nestjs/swagger';
import { StudentStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class StudentFilterDto {
  @ApiPropertyOptional({
    enum: StudentStatus,
    example: StudentStatus.ACTIVE,
    description: 'Trạng thái học viên',
  })
  @IsOptional()
  @IsEnum(StudentStatus)
  status?: StudentStatus;

  @ApiPropertyOptional({
    example: '',
    description: 'Từ khóa tìm kiếm theo tên, email',
  })
  @IsOptional()
  @IsString()
  keySearch?: string;
}

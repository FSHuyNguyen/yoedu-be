import { ApiPropertyOptional } from '@nestjs/swagger';
import { TeacherStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class TeacherFilterDto {
  @ApiPropertyOptional({
    enum: TeacherStatus,
    example: TeacherStatus.ACTIVE,
    description: 'Trạng thái giáo viên',
  })
  @IsOptional()
  @IsEnum(TeacherStatus)
  status?: TeacherStatus;

  @ApiPropertyOptional({
    example: '',
    description: 'Từ khóa tìm kiếm theo tên, email',
  })
  @IsOptional()
  @IsString()
  keySearch?: string;
}

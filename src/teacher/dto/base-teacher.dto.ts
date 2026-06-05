import { ApiPropertyOptional } from '@nestjs/swagger';
import { TeacherRole } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class BaseTeacherDto {
  @ApiPropertyOptional({
    enum: TeacherRole,
    example: TeacherRole.TEACHER,
    description: 'Vai trò giáo viên',
  })
  @IsOptional()
  @IsEnum(TeacherRole)
  teacherRole?: TeacherRole;

  @ApiPropertyOptional({
    example: 'IELTS, TOEIC',
    description: 'Chuyên môn giảng dạy',
  })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiPropertyOptional({
    example: 'Cử nhân Ngôn ngữ Anh - Đại học Sư phạm TP.HCM',
    description: 'Trình độ/chứng chỉ chuyên môn',
  })
  @IsOptional()
  @IsString()
  qualification?: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'Số năm kinh nghiệm giảng dạy',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  yearsOfExperience?: number;

  @ApiPropertyOptional({
    example: 'Có thể dạy online buổi tối',
    description: 'Ghi chú thêm',
  })
  @IsOptional()
  @IsString()
  note?: string;
}

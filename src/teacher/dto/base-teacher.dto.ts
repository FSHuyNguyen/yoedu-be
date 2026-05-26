import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class BaseTeacherDto {
  @ApiPropertyOptional({
    example: 'Giáo viên IELTS với hơn 5 năm kinh nghiệm giảng dạy',
    description: 'Giới thiệu ngắn về giáo viên',
  })
  @IsOptional()
  @IsString()
  bio?: string;

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
    description: 'Số năm kinh nghiệm',
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

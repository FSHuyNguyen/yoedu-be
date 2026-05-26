import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class BaseStudentDto {
  @ApiPropertyOptional({
    example: 'Nguyễn Văn A',
    description: 'Tên phụ huynh',
  })
  @IsOptional()
  @IsString()
  parentName?: string;

  @ApiPropertyOptional({
    example: '0901234567',
    description: 'Số điện thoại phụ huynh',
  })
  @IsOptional()
  @IsString()
  parentPhone?: string;

  @ApiPropertyOptional({
    example: 'THPT Nguyễn Du',
    description: 'Tên trường học',
  })
  @IsOptional()
  @IsString()
  schoolName?: string;

  @ApiPropertyOptional({
    example: '12',
    description: 'Khối/lớp hiện tại',
  })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiPropertyOptional({
    example: 'Khá',
    description: 'Trình độ học lực đầu vào',
  })
  @IsOptional()
  @IsString()
  entryAcademicLevel?: string;

  @ApiPropertyOptional({
    example: 8.5,
    description: 'Điểm bài test gần nhất',
  })
  @IsOptional()
  @IsNumber()
  latestTestScore?: number;

  @ApiPropertyOptional({
    example: 'Thi đại học khối A1',
    description: 'Mục tiêu học tập',
  })
  @IsOptional()
  @IsString()
  learningGoal?: string;

  @ApiPropertyOptional({
    example: 'Cần cải thiện kỹ năng speaking',
    description: 'Ghi chú thêm',
  })
  @IsOptional()
  @IsString()
  note?: string;
}

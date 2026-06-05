import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class BaseStudentDto {
  @ApiPropertyOptional({
    example: null,
    description: 'ID phụ huynh',
  })
  @IsOptional()
  @IsString()
  parentId?: string;

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
  gradeLevel?: string;

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
  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
    {
      message: 'latestTestScore chỉ được tối đa 2 chữ số thập phân',
    },
  )
  @Min(0)
  @Max(99.99)
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

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseCourseClassDto {
  @ApiProperty({
    example: 'Lớp IELTS 1',
    description: 'Tên lớp học',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: '1',
    description: 'ID của khóa học',
  })
  @IsString()
  courseId!: string;

  @ApiProperty({
    example: '1',
    description: 'ID của phòng học',
  })
  @IsString()
  roomId!: string;

  @ApiProperty({
    example: '1',
    description: 'ID của ca học',
  })
  @IsString()
  scheduleSlotId!: string;

  @ApiProperty({
    example: '1',
    description: 'ID của giáo viên chính',
  })
  @IsString()
  mainTeacherId!: string;

  @ApiPropertyOptional({
    example: '1',
    description: 'ID của giáo viên phụ',
  })
  @IsOptional()
  @IsString()
  assistantTeacherId?: string;

  @ApiProperty({
    example: '2024-09-01',
    description: 'Ngày bắt đầu lớp học',
  })
  @IsString()
  startDate!: string;

  @ApiProperty({
    example: '2024-09-01',
    description: 'Ngày kết thúc lớp học',
  })
  @IsString()
  endDate!: string;

  @ApiPropertyOptional({
    example: 25,
    description: 'Số lượng học viên tối đa',
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  maxStudents?: number;

  @ApiPropertyOptional({
    example: 5000000,
    description: 'Học phí khóa học',
  })
  @Type(() => Number)
  @IsNumber()
  tuitionFee!: number;
}

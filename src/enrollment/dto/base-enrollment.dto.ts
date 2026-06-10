import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

export class BaseEnrollmentDto {
  @ApiProperty({
    example: null,
    description: 'ID học viên',
  })
  @IsString()
  studentId!: string;

  @ApiProperty({
    example: null,
    description: 'ID lớp học',
  })
  @IsString()
  courseClassId!: string;

  @ApiPropertyOptional({
    example: 'Đã đóng học phí đợt 1',
    description: 'Ghi chú',
  })
  @IsOptional()
  @IsString()
  note?: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { LeaveRequestStatus } from '@prisma/client';

import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterLeaveRequestDto {
  @ApiPropertyOptional({
    example: null,
    description: 'ID của buổi học',
  })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'ID học sinh',
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    enum: LeaveRequestStatus,
    example: LeaveRequestStatus.PENDING,
    description: 'Trạng thái đơn xin nghỉ',
  })
  @IsOptional()
  @IsEnum(LeaveRequestStatus)
  status?: LeaveRequestStatus;
}

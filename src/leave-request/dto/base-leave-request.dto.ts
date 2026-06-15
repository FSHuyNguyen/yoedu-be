import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class BaseLeaveRequestDto {
  @ApiProperty({
    example: null,
    description: 'ID của buổi học',
  })
  @IsUUID()
  sessionId!: string;

  @ApiProperty({
    example: 'Con bị ốm nên xin nghỉ học',
    description: 'Lý do xin nghỉ học',
  })
  @IsString()
  reason!: string;
}

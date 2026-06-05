import { IsString } from 'class-validator';

import { BaseUserDto } from './base-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends BaseUserDto {
  @ApiProperty({
    example: '123456',
    description: 'Mật khẩu của học viên',
  })
  @IsString()
  password!: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'Email đăng nhập',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Admin@123',
    description: 'Mật khẩu đăng nhập',
  })
  @IsString()
  password!: string;
}

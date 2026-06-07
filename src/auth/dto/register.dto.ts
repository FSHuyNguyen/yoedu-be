import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Nguyen Van A',
    description: 'Họ và tên người dùng',
  })
  @IsString()
  fullName!: string;

  @ApiProperty({
    example: 'user@gmail.com',
    description: 'Email đăng ký',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'Mật khẩu tối thiểu 6 ký tự',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;
}

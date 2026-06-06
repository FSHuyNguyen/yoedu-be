import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class BaseUserDto {
  @ApiProperty({
    example: 'student@example.com',
    description: 'Email của user',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Nguyên Văn A',
    description: 'Họ và tên của user',
  })
  @IsString()
  fullName!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}

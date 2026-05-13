import { Gender } from '@prisma/client';

import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class BaseUserDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  fullName?: string;

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

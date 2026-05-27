import { Status } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UserFilterDto {
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsString()
  keySearch?: string;
}

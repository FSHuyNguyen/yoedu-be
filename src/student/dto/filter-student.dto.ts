import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FiltersStudentDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  keySearch?: string;
}

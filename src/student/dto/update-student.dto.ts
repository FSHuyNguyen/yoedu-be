import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  studentCode?: string;

  @IsOptional()
  @IsString()
  parentName?: string;

  @IsOptional()
  @IsString()
  parentPhone?: string;

  @IsOptional()
  @IsString()
  entryAcademicLevel?: string;

  @IsOptional()
  @IsNumber()
  latestTestScore?: number;
}

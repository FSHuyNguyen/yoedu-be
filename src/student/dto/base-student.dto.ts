import { IsNumber, IsOptional, IsString } from 'class-validator';

export class BaseStudentDto {
  @IsOptional()
  @IsString()
  parentName?: string;

  @IsOptional()
  @IsString()
  parentPhone?: string;

  @IsOptional()
  @IsString()
  schoolName?: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsString()
  entryAcademicLevel?: string;

  @IsOptional()
  @IsNumber()
  latestTestScore?: number;

  @IsOptional()
  @IsString()
  learningGoal?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

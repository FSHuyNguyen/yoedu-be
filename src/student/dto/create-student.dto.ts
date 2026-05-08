import { IsOptional, IsString, IsNumber } from 'class-validator';
import { AuthUserDto } from '../../user/dto/user.dto';

export class CreateStudentDto extends AuthUserDto {
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

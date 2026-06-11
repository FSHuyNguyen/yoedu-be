import { PartialType } from '@nestjs/swagger';
import { CreateCourseClassSessionDto } from './create-course-class-session.dto';

export class UpdateCourseClassSessionDto extends PartialType(
  CreateCourseClassSessionDto,
) {}

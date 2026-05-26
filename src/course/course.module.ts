import { Module } from '@nestjs/common';

import { CourseController } from './course.controller';
import { CourseService } from './course.service';

import { PrismaModule } from '../prisma/prisma.module';
import { TeacherModule } from '../teacher/teacher.module';

@Module({
  imports: [PrismaModule, TeacherModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}

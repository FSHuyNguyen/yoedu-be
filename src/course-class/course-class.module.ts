import { Module } from '@nestjs/common';
import { CourseClassService } from './course-class.service';
import { CourseClassController } from './course-class.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CourseClassController],
  providers: [CourseClassService],
})
export class CourseClassModule {}

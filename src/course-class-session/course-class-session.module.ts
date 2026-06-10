import { Module } from '@nestjs/common';
import { CourseClassSessionService } from './course-class-session.service';
import { CourseClassSessionController } from './course-class-session.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CourseClassModule } from '../course-class/course-class.module';

@Module({
  imports: [PrismaModule, CourseClassModule],
  exports: [CourseClassSessionService],
  controllers: [CourseClassSessionController],
  providers: [CourseClassSessionService],
})
export class CourseClassSessionModule {}

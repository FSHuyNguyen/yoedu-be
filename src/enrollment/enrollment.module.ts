import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StudentModule } from '../student/student.module';
import { CourseClassModule } from '../course-class/course-class.module';

@Module({
  imports: [PrismaModule, StudentModule, CourseClassModule],
  exports: [EnrollmentService],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
})
export class EnrollmentModule {}

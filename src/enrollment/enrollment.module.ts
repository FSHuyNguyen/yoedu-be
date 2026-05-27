import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CourseModule } from '../course/course.module';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [PrismaModule, StudentModule, CourseModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
})
export class EnrollmentModule {}

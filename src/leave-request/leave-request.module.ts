import { Module } from '@nestjs/common';
import { LeaveRequestService } from './leave-request.service';
import { LeaveRequestController } from './leave-request.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StudentModule } from '../student/student.module';
import { CourseClassSessionModule } from '../course-class-session/course-class-session.module';
import { EnrollmentModule } from '../enrollment/enrollment.module';

@Module({
  imports: [
    PrismaModule,
    StudentModule,
    CourseClassSessionModule,
    EnrollmentModule,
  ],
  controllers: [LeaveRequestController],
  providers: [LeaveRequestService],
})
export class LeaveRequestModule {}

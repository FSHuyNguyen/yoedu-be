import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { UploadModule } from './upload/upload.module';
import { CourseModule } from './course/course.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { ParentModule } from './parent/parent.module';
import { RoomModule } from './room/room.module';
import { ScheduleModule } from './schedule/schedule.module';
import { CourseClassModule } from './course-class/course-class.module';
import { CourseClassSessionModule } from './course-class-session/course-class-session.module';
import { LeaveRequestModule } from './leave-request/leave-request.module';
import { TuitionInvoiceModule } from './tuition-invoice/tuition-invoice.module';
import { PromotionModule } from './promotion/promotion.module';
import { PaymentModule } from './payment/payment.module';
import { NotificationModule } from './notification/notification.module';
import { ScheduleModule as ScheduleModuleLibrary } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModuleLibrary.forRoot(),
    AuthModule,
    UserModule,
    DashboardModule,
    StudentModule,
    TeacherModule,
    UploadModule,
    CourseModule,
    ParentModule,
    RoomModule,
    ScheduleModule,
    CourseClassModule,
    EnrollmentModule,
    CourseClassSessionModule,
    LeaveRequestModule,
    TuitionInvoiceModule,
    PromotionModule,
    PaymentModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

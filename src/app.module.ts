import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { UploadModule } from './upload/upload.module';
import { CourseModule } from './course/course.module';
import { DashboardModule } from './dashboard/dashboard.module';
// import { EnrollmentModule } from './enrollment/enrollment.module';
import { ParentModule } from './parent/parent.module';
import { RoomModule } from './room/room.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    // EnrollmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

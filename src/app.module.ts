import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { UploadModule } from './upload/upload.module';
import { CourseModule } from './course/course.module';
// import { UploadModule } from './upload/upload.module';
// import { CourseModule } from './course/course.module';
// import { EnrollmentModule } from './enrollment/enrollment.module';
// import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    StudentModule,
    TeacherModule,
    UploadModule,
    CourseModule,
    // EnrollmentModule,
    // DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

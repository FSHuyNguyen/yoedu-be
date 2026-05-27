import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import { UserModule } from './user/user.module';
import { TeacherModule } from './teacher/teacher.module';
import { UploadModule } from './upload/upload.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    StudentModule,
    UserModule,
    TeacherModule,
    UploadModule,
    CourseModule,
    EnrollmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

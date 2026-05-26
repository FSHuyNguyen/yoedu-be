import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, UserModule],
  exports: [TeacherService],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}

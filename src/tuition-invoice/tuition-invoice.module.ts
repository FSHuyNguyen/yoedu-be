import { Module } from '@nestjs/common';
import { TuitionInvoiceService } from './tuition-invoice.service';
import { TuitionInvoiceController } from './tuition-invoice.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StudentModule } from '../student/student.module';
import { CourseClassModule } from '../course-class/course-class.module';
import { EnrollmentModule } from '../enrollment/enrollment.module';
import { PromotionModule } from '../promotion/promotion.module';

@Module({
  imports: [
    PrismaModule,
    StudentModule,
    CourseClassModule,
    EnrollmentModule,
    PromotionModule,
  ],
  exports: [TuitionInvoiceService],
  controllers: [TuitionInvoiceController],
  providers: [TuitionInvoiceService],
})
export class TuitionInvoiceModule {}

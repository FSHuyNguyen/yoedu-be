import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TuitionInvoiceModule } from '../tuition-invoice/tuition-invoice.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, TuitionInvoiceModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}

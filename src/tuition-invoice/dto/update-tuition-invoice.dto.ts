import { PartialType } from '@nestjs/swagger';
import { CreateTuitionInvoiceDto } from './create-tuition-invoice.dto';

export class UpdateTuitionInvoiceDto extends PartialType(
  CreateTuitionInvoiceDto,
) {}

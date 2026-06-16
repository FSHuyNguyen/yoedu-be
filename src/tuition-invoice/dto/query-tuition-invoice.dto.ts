import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { FilterTuitionInvoiceDto } from './filter-tuition-invoice.dto';

export class TuitionInvoiceQueryDto extends IntersectionType(
  PaginationDto,
  FilterTuitionInvoiceDto,
) {}

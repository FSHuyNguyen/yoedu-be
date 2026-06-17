import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { FilterPaymentDto } from './filter-payment.dto';

export class PaymentQueryDto extends IntersectionType(
  PaginationDto,
  FilterPaymentDto,
) {}

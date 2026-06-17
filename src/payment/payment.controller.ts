import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/types/auth-jwt-user.type';

import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentQueryDto } from './dto/query-payment.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  create(@Body() dto: CreatePaymentDto, @CurrentUser() currentUser: AuthUser) {
    return this.paymentService.create(dto, currentUser);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STAFF)
  findAll(@Query() query: PaymentQueryDto) {
    return this.paymentService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  findById(@Param('id') id: string) {
    return this.paymentService.findById(id);
  }
}

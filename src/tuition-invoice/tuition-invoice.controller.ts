import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TuitionInvoiceService } from './tuition-invoice.service';
import { CreateTuitionInvoiceDto } from './dto/create-tuition-invoice.dto';
import { UpdateTuitionInvoiceDto } from './dto/update-tuition-invoice.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { TuitionInvoiceQueryDto } from './dto/query-tuition-invoice.dto';
import type { AuthUser } from '../auth/types/auth-jwt-user.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tuition-invoices')
export class TuitionInvoiceController {
  constructor(private readonly tuitionInvoiceService: TuitionInvoiceService) {}

  @Get('options')
  getTuitionOptions() {
    return this.tuitionInvoiceService.getTuitionOptions();
  }

  @Get('me')
  @Roles(Role.STUDENT)
  findAllMe(
    @CurrentUser() currentUser: AuthUser,
    @Query() query: TuitionInvoiceQueryDto,
  ) {
    return this.tuitionInvoiceService.findAllMe(currentUser, query);
  }

  @Get('me/:id')
  @Roles(Role.STUDENT)
  findMeInvoice(@CurrentUser() currentUser: AuthUser, @Param('id') id: string) {
    return this.tuitionInvoiceService.findMeInvoice(currentUser, id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  create(@Body() dto: CreateTuitionInvoiceDto) {
    return this.tuitionInvoiceService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STAFF)
  findAll(@Query() query: TuitionInvoiceQueryDto) {
    return this.tuitionInvoiceService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  findById(@Param('id') id: string) {
    return this.tuitionInvoiceService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  update(@Param('id') id: string, @Body() dto: UpdateTuitionInvoiceDto) {
    return this.tuitionInvoiceService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  remove(@Param('id') id: string) {
    return this.tuitionInvoiceService.remove(id);
  }
}

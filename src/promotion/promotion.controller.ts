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
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PromotionQueryDto } from './dto/query-create-promotion.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Get('options')
  getPromotionOptions() {
    return this.promotionService.getPromotionOptions();
  }

  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Tạo chương trình khuyến mãi',
  })
  create(@Body() dto: CreatePromotionDto) {
    return this.promotionService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Lấy danh sách chương trình khuyến mãi',
  })
  findAll(@Query() query: PromotionQueryDto) {
    return this.promotionService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Lấy chi tiết chương trình khuyến mãi',
  })
  findById(@Param('id') id: string) {
    return this.promotionService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Cập nhật chương trình khuyến mãi',
  })
  update(@Param('id') id: string, @Body() dto: UpdatePromotionDto) {
    return this.promotionService.update(id, dto);
  }

  @Patch(':id/active')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Kích hoạt chương trình khuyến mãi',
  })
  active(@Param('id') id: string) {
    return this.promotionService.active(id);
  }

  @Patch(':id/inactive')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Vô hiệu hóa chương trình khuyến mãi',
  })
  inactive(@Param('id') id: string) {
    return this.promotionService.inactive(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Xóa chương trình khuyến mãi',
  })
  remove(@Param('id') id: string) {
    return this.promotionService.remove(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ParentService } from './parent.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { ParentQueryDto } from './dto/query-parent.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import type { AuthUser } from '../auth/types/auth-jwt-user.type';

@Controller('parents')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get('options')
  getParentOptions() {
    return this.parentService.getParentOptions();
  }

  @Patch('me')
  @Roles(Role.PARENT)
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateParentDto) {
    return this.parentService.update(user.id, dto);
  }

  @Roles(Role.ADMIN, Role.STAFF)
  @Post()
  create(@Body() dto: CreateParentDto) {
    return this.parentService.create(dto);
  }

  @Roles(Role.ADMIN, Role.STAFF)
  @Get()
  findAll(@Query() query: ParentQueryDto) {
    return this.parentService.findAll(query);
  }

  @Roles(Role.ADMIN, Role.STAFF)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.parentService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  update(@Param('id') id: string, @Body() dto: UpdateParentDto) {
    return this.parentService.update(id, dto);
  }
}

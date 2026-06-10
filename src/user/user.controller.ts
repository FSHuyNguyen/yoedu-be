import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';

import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserQueryDto } from './dto/query-user.dto';
import { Role } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import type { AuthUser } from '../auth/types/auth-jwt-user.type';
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@CurrentUser() user: AuthUser) {
    return this.userService.getMe(user.id);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateUserDto) {
    return this.userService.updateMe(user.id, dto);
  }

  @Patch('change-password')
  changePassword(
    @CurrentUser() user: AuthUser,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(user.id, dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STAFF)
  findAll(@Query() query: UserQueryDto) {
    return this.userService.findAll(query);
  }

  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id/active')
  @Roles(Role.ADMIN, Role.STAFF)
  active(@Param('id') id: string) {
    return this.userService.active(id);
  }

  @Patch(':id/inactive')
  @Roles(Role.ADMIN, Role.STAFF)
  unActive(@Param('id') id: string) {
    return this.userService.unActive(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}

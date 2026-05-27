import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /users/me
  @Get('me')
  getMe(@CurrentUser() user: any) {
    return this.userService.getMe(String(user.id));
  }

  // PATCH /users/me
  @Patch('me')
  updateMe(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.userService.updateMe(String(user.id), dto);
  }

  // PATCH /users/change-password
  @Patch('change-password')
  changePassword(@CurrentUser() user: any, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(String(user.id), dto);
  }

  // GET /users
  // GET /users?status=ACTIVE
  @Get()
  @Roles(Role.ADMIN)
  findAll(@Query() query: UserQueryDto) {
    return this.userService.findAll(query);
  }

  // GET /users/:id
  @Get(':id')
  @Roles(Role.ADMIN)
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  // PATCH /users/:id/change-status
  @Patch(':id/change-status')
  @Roles(Role.ADMIN)
  changeStatus(@Param('id') id: string) {
    return this.userService.changeStatus(id);
  }

  // DELETE /users/:id
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}

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
import { UserFiltersDto } from './dto/user-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /users/me
  @Get('me')
  getMe(@CurrentUser() user: any) {
    return this.userService.getMe(user.id);
  }

  // PATCH /users/me
  @Patch('me')
  updateMe(
    @CurrentUser() user: any,
    @Body()
    dto: UpdateUserDto,
  ) {
    return this.userService.updateMe(user.id, dto);
  }

  // PATCH /users/change-password
  @Patch('change-password')
  changePassword(
    @CurrentUser() user: any,
    @Body()
    dto: {
      oldPassword: string;
      newPassword: string;
    },
  ) {
    return this.userService.changePassword(user.id, dto);
  }

  // GET /users
  // GET /users?status=ACTIVE
  @Get()
  @Roles('ADMIN')
  findAll(@Query() filters: UserFiltersDto) {
    return this.userService.findAll(filters);
  }

  // GET /users/:id
  @Get(':id')
  @Roles('ADMIN')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  // PATCH /users/:id/change-status
  @Patch(':id/change-status')
  @Roles('ADMIN')
  changeStatus(@Param('id') id: string) {
    return this.userService.changeStatus(id);
  }

  // DELETE /users/:id
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}

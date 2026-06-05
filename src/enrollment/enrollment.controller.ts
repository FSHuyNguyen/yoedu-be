// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
//   Query,
//   UseGuards,
// } from '@nestjs/common';

// import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

// import { Role } from '@prisma/client';

// import { EnrollmentService } from './enrollment.service';

// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';

// import { Roles } from '../auth/decorators/roles.decorator';
// import { CurrentUser } from '../auth/decorators/current-user.decorator';

// import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
// import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
// import { EnrollmentQueryDto } from './dto/query-enrollment.dto';

// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Controller('enrollments')
export class EnrollmentController {
  // constructor(private readonly enrollmentService: EnrollmentService) {}
  // @Post()
  // @Roles(Role.ADMIN)
  // @ApiOperation({
  //   summary: 'Đăng ký học viên vào khóa học',
  // })
  // create(@Body() dto: CreateEnrollmentDto) {
  //   return this.enrollmentService.create(dto);
  // }
  // @Get()
  // @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  // @ApiOperation({
  //   summary: 'Lấy danh sách đăng ký khóa học',
  // })
  // findAll(@CurrentUser() user: any, @Query() query: EnrollmentQueryDto) {
  //   return this.enrollmentService.findAll(user, query);
  // }
  // @Get(':id')
  // @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  // @ApiOperation({
  //   summary: 'Lấy chi tiết đăng ký khóa học',
  // })
  // findById(@CurrentUser() user: any, @Param('id') id: string) {
  //   return this.enrollmentService.findById(user, id);
  // }
  // @Patch(':id')
  // @Roles(Role.ADMIN)
  // @ApiOperation({
  //   summary: 'Cập nhật đăng ký khóa học',
  // })
  // update(@Param('id') id: string, @Body() dto: UpdateEnrollmentDto) {
  //   return this.enrollmentService.update(id, dto);
  // }
  // @Delete(':id')
  // @Roles(Role.ADMIN)
  // @ApiOperation({
  //   summary: 'Xóa đăng ký khóa học',
  // })
  // remove(@Param('id') id: string) {
  //   return this.enrollmentService.remove(id);
  // }
}

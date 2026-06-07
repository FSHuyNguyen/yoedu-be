import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role, Status } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UserFilterDto {
  @ApiPropertyOptional({
    enum: Status,
    example: Status.ACTIVE,
    description: 'Trạng thái tài khoản',
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({
    enum: Role,
    example: Role.ADMIN,
    description: 'Vai trò của người dùng',
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    enum: Status,
    example: Status.ACTIVE,
    description: 'Từ khóa tìm kiếm theo tên, email',
  })
  @IsOptional()
  @IsString()
  keySearch?: string;
}

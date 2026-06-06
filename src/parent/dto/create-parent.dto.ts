import { IntersectionType } from '@nestjs/swagger';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { BaseParentDto } from './base-parent.dto';

export class CreateParentDto extends IntersectionType(
  CreateUserDto,
  BaseParentDto,
) {}

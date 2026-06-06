import { IntersectionType } from '@nestjs/swagger';
import { UpdateUserDto } from '../../user/dto/update-user.dto';
import { BaseParentDto } from './base-parent.dto';

export class UpdateParentDto extends IntersectionType(
  UpdateUserDto,
  BaseParentDto,
) {}

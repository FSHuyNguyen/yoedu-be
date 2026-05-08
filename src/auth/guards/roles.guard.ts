import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // lấy roles được khai báo từ @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [
        context.getHandler(), // method
        context.getClass(), // controller
      ],
    );

    // nếu không có @Roles → cho qua
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // lấy user từ request (JwtAuthGuard đã gắn vào)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // nếu chưa có user → reject
    if (!user) {
      return false;
    }

    // check role
    return requiredRoles.includes(user.role);
  }
}

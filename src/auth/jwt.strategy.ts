import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AuthUser, JwtPayload } from './types/auth-jwt-user.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },

      select: {
        id: true,
        email: true,
        role: true,

        teacher: {
          select: {
            id: true,
          },
        },

        student: {
          select: {
            id: true,
          },
        },

        parent: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,

      teacherId: user.teacher?.id ?? null,
      studentId: user.student?.id ?? null,
      parentId: user.parent?.id ?? null,
    };
  }
}

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { StatusCode } from '../shared/utils/status';
import { CustomResponse } from '../shared/utils/response';
import { generateCode } from '../shared/utils/generate-code';
import { compare, encrypt } from '../shared/utils/bcrypt';
import { UserService } from '../user/user.service';
import { Role, Status } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { USER_DETAIL_SELECT } from '../user/constants/user.constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  private async generateTokens(userId: string, email: string, role: Role) {
    const payload = {
      sub: userId,
      email,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES'),
      }),

      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(dto: RegisterDto) {
    await this.userService.checkEmailExists(dto.email);

    const hashedPassword = await encrypt(dto.password);

    await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        fullName: dto.fullName,
        role: Role.STUDENT,
        student: {
          create: {
            studentCode: generateCode(Role.STUDENT),
          },
        },
      },
    });

    return CustomResponse(true, StatusCode.CREATED, 'Đăng ký thành công', null);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
      select: {
        password: true,

        ...USER_DETAIL_SELECT,
      },
    });

    if (!user) {
      throw new BadRequestException('Tài khoản hoặc mật khẩu không đúng');
    }

    const isMatch = await compare(dto.password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Tài khoản hoặc mật khẩu không đúng');
    }

    /* Kiểm tra trạng thái users */
    if (user.status === Status.INACTIVE || user.status === Status.DELETED) {
      throw new BadRequestException(
        'Tài khoản của bạn không còn hoạt động. Vui lòng liên hệ quản trị viên để biết thêm chi tiết',
      );
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    const hashedRefreshToken = await encrypt(tokens.refreshToken);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        refreshToken: hashedRefreshToken,
      },
    });

    const { password, ...userData } = user;

    return CustomResponse(true, StatusCode.OK, 'Đăng nhập thành công', {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userData,
    });
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userService.getUserByIdOrThrow(
        String(payload.sub),
        true,
      );

      if (!user) {
        throw new BadRequestException('Refresh token không hợp lệ');
      }

      if (user.status === Status.INACTIVE || user.status === Status.DELETED) {
        throw new BadRequestException('Tài khoản của bạn không còn hoạt động');
      }

      if (!user.refreshToken) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      // So sánh refresh token gửi lên với hash trong DB
      const isMatch = await compare(refreshToken, String(user.refreshToken));

      if (!isMatch) {
        throw new BadRequestException('Refresh token không hợp lệ');
      }

      // Sinh bộ token mới
      const tokens = await this.generateTokens(user.id, user.email, user.role);

      // Rotate refresh token
      const hashedRefreshToken = await encrypt(tokens.refreshToken);

      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          refreshToken: hashedRefreshToken,
        },
      });

      return CustomResponse(true, StatusCode.OK, 'Làm mới token thành công', {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch {
      throw new BadRequestException('Refresh token không hợp lệ');
    }
  }
}

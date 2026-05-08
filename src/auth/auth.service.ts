import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { StatusCode } from '../../utils/status';
import { CustomResponse } from '../../utils/response';
import { generateStudentCode } from '../../utils/generate-code';
import { comparePassword, hashPassword } from '../../utils/hash-password';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async register(dto: { email: string; password: string }) {
    await this.userService.checkEmailExists(dto.email);

    const hashedPassword = await hashPassword(dto.password);

    await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: 'STUDENT',

        student: {
          create: {
            studentCode: generateStudentCode(),
          },
        },
      },
    });

    return CustomResponse(true, StatusCode.CREATED, 'Đăng ký thành công', null);
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        student: true,
        teacher: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }

    const isMatch = await comparePassword(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return CustomResponse(true, StatusCode.OK, 'Đăng nhập thành công', {
      accessToken: token,
    });
  }
}

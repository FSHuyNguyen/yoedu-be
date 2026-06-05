import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { StatusCode } from '../shared/utils/status';
import { CustomResponse } from '../shared/utils/response';
import { generateCode } from '../shared/utils/generate-code';
import { comparePassword, hashPassword } from '../shared/utils/hash-password';
import { UserService } from '../user/user.service';
import { Role, Status } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { USER_DETAIL_SELECT } from '../user/constants/user.constants';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async register(dto: RegisterDto) {
    await this.userService.checkEmailExists(dto.email);

    const hashedPassword = await hashPassword(dto.password);

    await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
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

    const isMatch = await comparePassword(dto.password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Tài khoản hoặc mật khẩu không đúng');
    }

    /* Kiểm tra trạng thái users */
    if (user.status === Status.INACTIVE || user.status === Status.DELETED) {
      throw new BadRequestException(
        'Tài khoản của bạn không còn hoạt động. Vui lòng liên hệ quản trị viên để biết thêm chi tiết',
      );
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const { password, ...userResponse } = user;

    return CustomResponse(true, StatusCode.OK, 'Đăng nhập thành công', {
      accessToken: token,
      user: userResponse,
    });
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PrismaService } from '../prisma/prisma.service';
import { generateCode } from '../shared/utils/generate-code';
import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';
import { PromotionQueryDto } from './dto/query-create-promotion.dto';
import { Prisma, PromotionStatus } from '@prisma/client';
import { mapPromotionResponse } from './mappers/promotion.mapper';

@Injectable()
export class PromotionService {
  constructor(private readonly prismaService: PrismaService) {}

  /*************************************************************
   * HELPERS
   *************************************************************/
  async getPromotionByIdOrThrow(id: string) {
    const promotion = await this.prismaService.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException('Không tìm thấy chương trình khuyến mãi');
    }

    return promotion;
  }

  async getPromotionOptions() {
    const promotions = await this.prismaService.promotion.findMany({
      where: {
        status: PromotionStatus.ACTIVE,
      },
    });

    return promotions.map((promotion) => ({
      ...promotion,
      value: promotion.id,
      label: promotion.name,
    }));
  }

  private checkPromotionDateRange(startDate: Date, endDate: Date) {
    if (startDate >= endDate) {
      throw new BadRequestException('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
    }

    return { start: startDate, end: endDate };
  }

  async create(dto: CreatePromotionDto) {
    const startDate = new Date(dto.startDate);

    const endDate = new Date(dto.endDate);

    const { start, end } = this.checkPromotionDateRange(startDate, endDate);

    await this.prismaService.promotion.create({
      data: {
        promoCode: generateCode('PROMO'),

        name: dto.name,

        discountType: dto.discountType,

        discountValue: dto.discountValue,

        startDate: start,

        endDate: end,

        note: dto.note,
      },
    });

    return CustomResponse(
      true,
      StatusCode.CREATED,
      'Tạo chương trình khuyến mãi thành công',
      null,
    );
  }

  async update(id: string, dto: UpdatePromotionDto) {
    const promotion = await this.getPromotionByIdOrThrow(id);

    const start = dto.startDate ? new Date(dto.startDate) : promotion.startDate;

    const end = dto.endDate ? new Date(dto.endDate) : promotion.endDate;

    this.checkPromotionDateRange(start, end);

    await this.prismaService.promotion.update({
      where: { id },
      data: {
        ...dto,

        startDate: dto.startDate ? new Date(dto.startDate) : undefined,

        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Cập nhật chương trình khuyến mãi thành công',
      null,
    );
  }

  async findAll(query: PromotionQueryDto) {
    const {
      page = 1,
      limit = 10,
      discountType,
      startDate,
      endDate,
      keySearch,
      status,
    } = query;

    const skip = (page - 1) * limit;

    const andConditions: Prisma.PromotionWhereInput[] = [];

    if (discountType) {
      andConditions.push({
        discountType,
      });
    }

    if (startDate) {
      andConditions.push({
        startDate: {
          gte: new Date(startDate),
        },
      });
    }

    if (endDate) {
      andConditions.push({
        endDate: {
          lte: new Date(endDate),
        },
      });
    }

    if (status) {
      andConditions.push({
        status,
      });
    }

    if (keySearch) {
      andConditions.push({
        OR: [
          {
            name: {
              contains: keySearch,
              mode: 'insensitive',
            },
          },
          {
            promoCode: {
              contains: keySearch,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    const where: Prisma.PromotionWhereInput =
      andConditions.length > 0
        ? {
            AND: andConditions,
          }
        : {};

    const [promotions, total] = await Promise.all([
      this.prismaService.promotion.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prismaService.promotion.count({
        where,
      }),
    ]);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy danh sách chương trình khuyến mãi thành công',
      {
        items: promotions.map(mapPromotionResponse),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    );
  }

  async findById(id: string) {
    const promotion = await this.getPromotionByIdOrThrow(id);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy chi tiết chương trình khuyến mãi thành công',
      mapPromotionResponse(promotion),
    );
  }

  async active(id: string) {
    const promotion = await this.getPromotionByIdOrThrow(id);

    if (promotion.status === PromotionStatus.ACTIVE) {
      throw new BadRequestException(
        'Chương trình khuyến mãi đã được kích hoạt',
      );
    }

    await this.prismaService.promotion.update({
      where: { id },
      data: { status: PromotionStatus.ACTIVE },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Kích hoạt chương trình khuyến mãi thành công',
      null,
    );
  }

  async inactive(id: string) {
    const promotion = await this.getPromotionByIdOrThrow(id);

    if (promotion.status === PromotionStatus.INACTIVE) {
      throw new BadRequestException(
        'Chương trình khuyến mãi đã bị vô hiệu hóa',
      );
    }

    await this.prismaService.promotion.update({
      where: { id },
      data: { status: PromotionStatus.INACTIVE },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Vô hiệu hóa chương trình khuyến mãi thành công',
      null,
    );
  }

  async remove(id: string) {
    const promotion = await this.getPromotionByIdOrThrow(id);

    if (promotion.status === PromotionStatus.ACTIVE) {
      throw new BadRequestException(
        'Không thể xóa chương trình khuyến mãi đang hoạt động',
      );
    }

    await this.prismaService.promotion.delete({
      where: { id },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Xóa chương trình khuyến mãi thành công',
      null,
    );
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { TuitionInvoiceService } from '../tuition-invoice/tuition-invoice.service';
import { PrismaService } from '../prisma/prisma.service';
import { StatusCode } from '../shared/utils/status';
import { CustomResponse } from '../shared/utils/response';
import { AuthUser } from '../auth/types/auth-jwt-user.type';
import { InvoiceStatus, Prisma } from '@prisma/client';
import { generateCode } from '../shared/utils/generate-code';
import { mapPaymentResponse, PAYMENT_INCLUDE } from './mappers/payment.mapper';
import { PaymentQueryDto } from './dto/query-payment.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tuitionInvoiceService: TuitionInvoiceService,
    private readonly notificationService: NotificationService,
  ) {}

  async getPaymentByIdOrThrow(id: string) {
    const payment = await this.prismaService.payment.findUnique({
      where: {
        id,
      },
      include: PAYMENT_INCLUDE,
    });

    if (!payment) {
      throw new NotFoundException('Không tìm thấy giao dịch thanh toán');
    }

    return payment;
  }

  async create(dto: CreatePaymentDto, currentUser: AuthUser) {
    const invoice = await this.tuitionInvoiceService.getInvoiceByIdOrThrow(
      dto.invoiceId,
    );

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Hóa đơn đã được thanh toán đầy đủ');
    }

    const paidAmount = dto.paidAmount;

    if (paidAmount <= 0) {
      throw new BadRequestException('Số tiền thanh toán phải lớn hơn 0');
    }

    if (paidAmount > Number(invoice.balanceAmount)) {
      throw new BadRequestException(
        'Số tiền thanh toán vượt quá số tiền còn lại',
      );
    }

    let payment: any;

    await this.prismaService.$transaction(async (tx) => {
      const newAmountPaid = Number(invoice.amountPaid) + paidAmount;

      const newBalanceAmount = Number(invoice.finalAmount) - newAmountPaid;

      const status =
        newBalanceAmount === 0 ? InvoiceStatus.PAID : InvoiceStatus.PARTIAL;

      payment = await tx.payment.create({
        data: {
          paymentCode: generateCode('PAY'),

          invoiceId: invoice.id,

          paidAmount,

          paymentMethod: dto.paymentMethod,

          paidAt: new Date(),

          cashierUserId: currentUser.id,

          note: dto.note,
        },
      });

      await tx.tuitionInvoice.update({
        where: {
          id: invoice.id,
        },
        data: {
          amountPaid: newAmountPaid,

          balanceAmount: newBalanceAmount,

          status,
        },
      });
    });

    await this.notificationService.notifyPaymentSuccess(
      invoice.student.userId,
      payment,
    );

    return CustomResponse(
      true,
      StatusCode.CREATED,
      'Thanh toán học phí thành công',
      null,
    );
  }

  async findAll(query: PaymentQueryDto) {
    const {
      page = 1,
      limit = 10,
      invoiceId,
      paymentMethod,
      paidAtFrom,
      paidAtTo,
      status,
    } = query;

    const skip = (page - 1) * limit;

    const andConditions: Prisma.PaymentWhereInput[] = [];

    if (invoiceId) {
      andConditions.push({
        invoiceId,
      });
    }

    if (paymentMethod) {
      andConditions.push({
        paymentMethod,
      });
    }

    if (paidAtFrom) {
      andConditions.push({
        paidAt: {
          gte: new Date(paidAtFrom),
        },
      });
    }

    if (paidAtTo) {
      andConditions.push({
        paidAt: {
          lte: new Date(paidAtTo),
        },
      });
    }

    if (status) {
      andConditions.push({
        status,
      });
    }

    const where: Prisma.PaymentWhereInput =
      andConditions.length > 0
        ? {
            AND: andConditions,
          }
        : {};

    const [payments, total] = await Promise.all([
      this.prismaService.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          paidAt: 'desc',
        },
        include: PAYMENT_INCLUDE,
      }),

      this.prismaService.payment.count({
        where,
      }),
    ]);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy danh sách thanh toán thành công',
      {
        items: payments.map(mapPaymentResponse),
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
    const payment = await this.getPaymentByIdOrThrow(id);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy chi tiết thanh toán thành công',
      mapPaymentResponse(payment),
    );
  }
}

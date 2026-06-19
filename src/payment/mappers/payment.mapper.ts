import { PaymentStatus, Prisma } from '@prisma/client';
import {
  USER_SELECT,
  BASE_USER_INCLUDE,
} from '../../user/constants/user.constants';

export const PAYMENT_INCLUDE = {
  invoice: {
    include: {
      student: {
        include: BASE_USER_INCLUDE,
      },
    },
  },
  cashierUser: {
    select: USER_SELECT,
  },
} satisfies Prisma.PaymentInclude;

export type PaymentResponse = Prisma.PaymentGetPayload<{
  include: typeof PAYMENT_INCLUDE;
}>;

const mappedStatusText: Record<PaymentStatus, string> = {
  SUCCESS: 'Thành công',
  CANCELLED: 'Đã hủy',
};

export const mapPaymentResponse = (payment: PaymentResponse) => {
  return {
    id: payment.id,

    paymentCode: payment.paymentCode,
    paidAmount: payment.paidAmount,

    invoiceId: payment.invoiceId,
    invoiceCode: payment.invoice?.invoiceCode,

    amountPaid: payment.invoice?.amountPaid,
    balanceAmount: payment.invoice?.balanceAmount,

    studentId: payment.invoice?.studentId,
    studentName: payment.invoice?.student?.user?.fullName,

    paymentMethod: payment.paymentMethod,

    note: payment.note ?? '',

    cashierUserId: payment.cashierUserId,
    cashierUserName: payment.cashierUser?.fullName,

    status: payment.status,
    statusText: mappedStatusText[payment.status],

    paidAt: payment.paidAt,

    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
  };
};

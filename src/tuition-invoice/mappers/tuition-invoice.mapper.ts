import { InvoiceStatus, Prisma } from '@prisma/client';
import { BASE_USER_INCLUDE } from '../../user/constants/user.constants';

export const TUITION_INVOICE_INCLUDE = {
  student: {
    include: BASE_USER_INCLUDE,
  },
  courseClass: {
    include: {
      course: true,
    },
  },
  promotion: true,
} satisfies Prisma.TuitionInvoiceInclude;

export type TuitionInvoiceResponse = Prisma.TuitionInvoiceGetPayload<{
  include: typeof TUITION_INVOICE_INCLUDE;
}>;

const mappedStatusText: Record<InvoiceStatus, string> = {
  UNPAID: 'Chưa thanh toán',
  PARTIAL: 'Đã thanh toán một phần',
  PAID: 'Đã thanh toán',
};

export const mapTuitionInvoiceResponse = (invoice: TuitionInvoiceResponse) => {
  return {
    id: invoice.id,

    invoiceCode: invoice.invoiceCode,

    studentId: invoice.studentId,
    studentName: invoice.student.user.fullName,

    courseClassId: invoice.courseClassId,
    courseClassName: invoice.courseClass.name,

    courseId: invoice.courseClass.courseId,
    courseName: invoice.courseClass.course.name,

    originalAmount: invoice.originalAmount,

    discountAmount: invoice.discountAmount,

    finalAmount: invoice.finalAmount,

    amountPaid: invoice.amountPaid,

    balanceAmount: invoice.balanceAmount,

    status: invoice.status,
    statusText: mappedStatusText[invoice.status],

    dueDate: invoice.dueDate,

    promotionId: invoice.promotionId,
    promotionName: invoice.promotion?.name,

    createdAt: invoice.createdAt,
    updatedAt: invoice.updatedAt,
  };
};

import { Promotion, PromotionStatus } from '@prisma/client';

const mappedStatusText: Record<PromotionStatus, string> = {
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Đã ngưng hoạt động',
  EXPIRED: 'Hết hạn',
};

export const mapPromotionResponse = (promotion: Promotion) => {
  return {
    id: promotion.id,

    promoCode: promotion.promoCode,

    name: promotion.name,

    discountType: promotion.discountType,

    discountValue: promotion.discountValue,

    startDate: promotion.startDate,
    endDate: promotion.endDate,

    status: promotion.status,
    statusText: mappedStatusText[promotion.status],

    note: promotion.note,

    createdAt: promotion.createdAt,
    updatedAt: promotion.updatedAt,
  };
};

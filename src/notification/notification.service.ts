import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    await this.prisma.notification.create({
      data: createNotificationDto,
    });

    return CustomResponse(
      true,
      StatusCode.CREATED,
      'Tạo thông báo thành công',
      null,
    );
  }

  async findAll(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy danh sách thông báo thành công',
      notifications,
    );
  }

  async findOne(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy thông báo thành công',
      notification,
    );
  }

  async getUnreadCount(userId: string) {
    const unreadCount = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy số lượng thông báo chưa đọc thành công',
      unreadCount,
    );
  }

  async markAsRead(id: string) {
    const notification = await this.prisma.notification.update({
      where: {
        id,
      },
      data: {
        isRead: true,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Đánh dấu thông báo là đã đọc thành công',
      notification,
    );
  }

  async markAllAsRead(userId: string) {
    const notification = await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Đánh dấu tất cả thông báo là đã đọc thành công',
      notification,
    );
  }

  async remove(id: string) {
    await this.prisma.notification.delete({
      where: {
        id,
      },
    });

    return CustomResponse(
      true,
      StatusCode.OK,
      'Xóa thông báo thành công',
      null,
    );
  }

  async createMany(
    userIds: string[],
    payload: Omit<CreateNotificationDto, 'userId'>,
  ) {
    await this.prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        ...payload,
      })),
    });

    return CustomResponse(
      true,
      StatusCode.CREATED,
      'Tạo nhiều thông báo thành công',
      null,
    );
  }

  //--------------------------------------
  // Domain actions
  //--------------------------------------
  notifyPaymentSuccess(userId: string, payment: any) {
    return this.create({
      userId,
      type: 'TUITION',
      title: 'Thanh toán thành công',
      content: `Bạn đã thanh toán thành công hóa đơn ${payment.invoiceId}.`,
      relatedEntityType: 'payment',
      relatedEntityId: payment.id,
    });
  }

  notifyAbsent(userId: string, attendanceId: string) {
    return this.create({
      userId,
      type: 'ABSENCE',
      title: 'Thông báo vắng học',
      content: 'Bạn đã vắng mặt một buổi học.',
      relatedEntityType: 'attendance',
      relatedEntityId: attendanceId,
    });
  }
}

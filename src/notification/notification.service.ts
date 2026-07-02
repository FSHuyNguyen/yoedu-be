import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CustomResponse } from '../shared/utils/response';
import { StatusCode } from '../shared/utils/status';
import {
  EnrollmentStatus,
  NotificationType,
  Prisma,
  SessionStatus,
} from '@prisma/client';
import { addMinutes, startOfMinute } from 'date-fns';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(NotificationService.name);

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
      type: NotificationType.TUITION,
      title: 'Thanh toán thành công',
      content: `Bạn đã thanh toán thành công hóa đơn ${payment.invoiceId}.`,
      relatedEntityType: 'payment',
      relatedEntityId: payment.id,
    });
  }

  notifyAbsent(userId: string, attendanceId: string) {
    return this.create({
      userId,
      type: NotificationType.ABSENCE,
      title: 'Thông báo vắng học',
      content: 'Bạn đã vắng mặt một buổi học.',
      relatedEntityType: 'attendance',
      relatedEntityId: attendanceId,
    });
  }

  // ------------------------------------
  // Cron jobs
  // ------------------------------------
  async sendClassReminder(reminderMinutes: number): Promise<void> {
    const start = startOfMinute(addMinutes(new Date(), reminderMinutes));

    const end = addMinutes(start, 1);

    /**
     * 1. Lấy tất cả session sắp diễn ra
     */
    const sessions = await this.prisma.courseClassSession.findMany({
      where: {
        status: SessionStatus.SCHEDULED,
        startTime: {
          gte: start,
          lt: end,
        },
      },
      include: {
        courseClass: {
          include: {
            enrollments: {
              where: {
                status: EnrollmentStatus.ACTIVE,
              },
              include: {
                student: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!sessions.length) {
      return;
    }

    for (const session of sessions) {
      const userIds = session.courseClass.enrollments.map(
        (item) => item.student.userId,
      );

      if (!userIds.length) continue;

      /**
       * 2. Kiểm tra đã gửi reminder chưa
       */
      const logs = await this.prisma.notificationLog.findMany({
        where: {
          sessionId: session.id,
          reminderMinutes,
          userId: {
            in: userIds,
          },
        },
      });

      const sentUserIds = new Set(logs.map((x) => x.userId));

      const notifications: Prisma.NotificationCreateManyInput[] = [];
      const notificationLogs: Prisma.NotificationLogCreateManyInput[] = [];

      /**
       * 3. Build Notification
       */
      for (const enrollment of session.courseClass.enrollments) {
        const user = enrollment.student.user;

        if (sentUserIds.has(user.id)) {
          continue;
        }

        notifications.push({
          userId: user.id,
          type: NotificationType.CLASS_REMINDER,
          title: 'Sắp đến giờ học',
          content: `Lớp "${session.courseClass.name}" sẽ bắt đầu sau ${reminderMinutes} phút.`,
          relatedEntityType: 'COURSE_CLASS_SESSION',
          relatedEntityId: session.id,
        });

        notificationLogs.push({
          sessionId: session.id,
          userId: user.id,
          reminderMinutes,
        });
      }

      /**
       * 4. Bulk Insert
       */
      await this.prisma.$transaction([
        this.prisma.notification.createMany({
          data: notifications,
        }),
        this.prisma.notificationLog.createMany({
          data: notificationLogs,
        }),
      ]);

      this.logger.log(
        `Reminder ${reminderMinutes} phút - Session ${session.id} - ${notifications.length} notifications`,
      );
    }
  }
}

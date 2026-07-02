import { Injectable } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationCronService {
  constructor(private readonly notificationService: NotificationService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleReminder() {
    const reminders = [60, 30];

    for (const minute of reminders) {
      await this.notificationService.sendClassReminder(minute);
    }
  }
}

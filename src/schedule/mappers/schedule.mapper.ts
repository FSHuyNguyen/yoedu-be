import { ScheduleSlot } from '@prisma/client';

export const mappedWeekday: Record<string, string> = {
  2: 'Thứ Hai',
  3: 'Thứ Ba',
  4: 'Thứ Tư',
  5: 'Thứ Năm',
  6: 'Thứ Sáu',
  7: 'Thứ Bảy',
  8: 'Chủ Nhật',
};

export const mapSchedule = (schedule: ScheduleSlot) => {
  const { weekday, startTime, endTime } = schedule;

  return `${mappedWeekday[weekday]} (${startTime} - ${endTime})`;
};

export const mapScheduleResponse = (schedule: ScheduleSlot) => {
  return {
    id: schedule.id,

    slotCode: schedule.slotCode,

    weekday: schedule.weekday,
    weekdayName: mappedWeekday[schedule.weekday],

    startTime: schedule.startTime,
    endTime: schedule.endTime,

    note: schedule.note,

    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
  };
};

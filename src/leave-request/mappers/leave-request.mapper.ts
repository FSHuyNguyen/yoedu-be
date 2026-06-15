import { LeaveRequestStatus, Prisma } from '@prisma/client';
import { BASE_USER_INCLUDE } from '../../user/constants/user.constants';
import { mappedWeekday } from '../../schedule/mappers/schedule.mapper';

export const LEAVE_REQUEST_INCLUDE = {
  student: {
    include: BASE_USER_INCLUDE,
  },
  session: {
    include: {
      courseClass: true,
      scheduleSlot: true,
    },
  },
} satisfies Prisma.LeaveRequestInclude;

export type LeaveRequestResponse = Prisma.LeaveRequestGetPayload<{
  include: typeof LEAVE_REQUEST_INCLUDE;
}>;

const mappedStatusText: Record<string, string> = {
  [LeaveRequestStatus.PENDING]: 'Chờ duyệt',
  [LeaveRequestStatus.APPROVED]: 'Đã phê duyệt',
  [LeaveRequestStatus.REJECTED]: 'Đã từ chối',
};

export const mapLeaveRequestResponse = (leaveRequest: LeaveRequestResponse) => {
  return {
    id: leaveRequest.id,

    studentId: leaveRequest.studentId,
    studentName: leaveRequest.student.user.fullName,

    sessionId: leaveRequest.session.id,

    courseClassId: leaveRequest.session.courseClass.id,
    courseClassName: leaveRequest.session.courseClass.name,

    scheduleSlotId: leaveRequest.session.scheduleSlot.id,
    scheduleSlotName: mappedWeekday[leaveRequest.session.scheduleSlot.weekday],

    startTime: leaveRequest.session.startTime,

    endTime: leaveRequest.session.endTime,

    status: leaveRequest.status,
    statusText: mappedStatusText[leaveRequest.status],

    reason: leaveRequest.reason,

    createdAt: leaveRequest.createdAt,

    updatedAt: leaveRequest.updatedAt,
  };
};

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusCode } from '../shared/utils/status';
import { CustomResponse } from '../shared/utils/response';
import { RECENT_LIMIT } from './constants/dashboard-recent';
import { ActivityType } from './enum/activity-type.enum';
import { getCurrentWeekdayCustom } from '../utils/date';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  private getTodaySchedule(
    schedules: {
      scheduleSlot: {
        weekday: number;
        startTime: string;
        endTime: string;
      };
    }[],
    currentWeekday: number,
  ) {
    return schedules.find(
      (item) => item.scheduleSlot.weekday === currentWeekday,
    );
  }

  async getDashboardData() {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const currentWeekday = getCurrentWeekdayCustom(now);

    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      activeClasses,
      newStudentsThisMonth,
      newTeachersThisMonth,
      newClassesThisMonth,

      recentStudents,
      recentTeachers,
      recentCourseClasses,
      recentEnrollments,

      todayClasses,
    ] = await Promise.all([
      /* Tổng học viên */
      this.prismaService.student.count(),

      /* Tổng giáo viên */
      this.prismaService.teacher.count(),

      /* Tổng lớp học */
      this.prismaService.courseClass.count(),

      /* Lớp đang hoạt động */
      this.prismaService.courseClass.count({
        where: {
          startDate: {
            lte: now,
          },

          endDate: {
            gte: now,
          },
        },
      }),

      /* Học viên mới tháng này */
      this.prismaService.student.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),

      /* Giáo viên mới tháng này */
      this.prismaService.teacher.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),

      /* Lớp mới tháng này */
      this.prismaService.courseClass.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),

      /* Hoạt động gần đây của học viên */
      this.prismaService.student.findMany({
        take: RECENT_LIMIT,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: true,
        },
      }),

      /* Hoạt động gần đây của giáo viên */
      this.prismaService.teacher.findMany({
        take: RECENT_LIMIT,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: true,
        },
      }),

      /* Hoạt động gần đây của lớp học */
      this.prismaService.courseClass.findMany({
        take: RECENT_LIMIT,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      /* Đăng ký gần đây */
      this.prismaService.enrollment.findMany({
        take: RECENT_LIMIT,
        orderBy: {
          enrolledAt: 'desc',
        },

        include: {
          student: {
            include: {
              user: true,
            },
          },

          courseClass: true,
        },
      }),

      /* Lớp học hôm nay */
      this.prismaService.courseClass.findMany({
        take: RECENT_LIMIT,

        where: {
          startDate: {
            lte: now,
          },

          endDate: {
            gte: now,
          },

          schedules: {
            some: {
              scheduleSlot: {
                weekday: currentWeekday,
              },
            },
          },
        },

        include: {
          schedules: {
            include: {
              scheduleSlot: true,
            },
          },

          mainTeacher: {
            include: {
              user: true,
            },
          },

          _count: {
            select: {
              enrollments: true,
            },
          },
        },
      }),
    ]);

    const recentActivityData = [
      ...recentStudents.map((student) => ({
        type: ActivityType.STUDENT,

        title: 'Học viên mới',

        message: `${student.user.fullName} đã được thêm vào hệ thống`,

        date: student.createdAt,
      })),

      ...recentTeachers.map((teacher) => ({
        type: ActivityType.TEACHER,

        title: 'Giáo viên mới',

        message: `${teacher.user.fullName} đã được thêm vào hệ thống`,

        date: teacher.createdAt,
      })),

      ...recentCourseClasses.map((courseClass) => ({
        type: ActivityType.COURSE_CLASS,

        title: 'Lớp học mới',

        message: `${courseClass.name} được tạo`,

        date: courseClass.createdAt,
      })),

      ...recentEnrollments.map((enrollment) => ({
        type: ActivityType.ENROLLMENT,

        title: 'Đăng ký lớp học',

        message: `${enrollment.student.user.fullName} đăng ký lớp ${enrollment.courseClass.name}`,

        date: enrollment.enrolledAt,
      })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, RECENT_LIMIT);

    return CustomResponse(
      true,
      StatusCode.OK,
      'Lấy dữ liệu dashboard thành công',
      {
        statData: [
          {
            title: 'Tổng học viên',
            value: `${totalStudents} người`,
            extra: `+${newStudentsThisMonth} tháng này`,
          },

          {
            title: 'Tổng giáo viên',
            value: `${totalTeachers} người`,
            extra: `+${newTeachersThisMonth} tháng này`,
          },

          {
            title: 'Tổng lớp học',
            value: `${totalClasses} lớp`,
            extra: `+${newClassesThisMonth} tháng này`,
          },

          {
            title: 'Lớp đang diễn ra',
            value: `${activeClasses} lớp`,
            extra: '',
          },
        ],

        recentActivityData,

        todayClasses: todayClasses.map((courseClass) => {
          const todaySchedule = this.getTodaySchedule(
            courseClass.schedules,
            currentWeekday,
          );

          return {
            name: courseClass.name,

            teacher: courseClass.mainTeacher.user.fullName,

            totalStudents: courseClass._count.enrollments,

            time: todaySchedule
              ? `${todaySchedule.scheduleSlot.startTime} - ${todaySchedule.scheduleSlot.endTime}`
              : '',
          };
        }),
      },
    );
  }
}

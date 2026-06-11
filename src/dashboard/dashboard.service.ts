import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusCode } from '../shared/utils/status';
import { CustomResponse } from '../shared/utils/response';
import { RECENT_LIMIT } from './constants/dashboard-recent';
import { ActivityType } from './enum/activity-type.enum';
import { endOfDay, formatDate, startOfDay, startOfMonth } from 'date-fns';
import { SessionStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDashboardData() {
    const now = new Date();

    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    const monthStart = startOfMonth(now);

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

      todaySessions,
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
            gte: monthStart,
          },
        },
      }),

      /* Giáo viên mới tháng này */
      this.prismaService.teacher.count({
        where: {
          createdAt: {
            gte: monthStart,
          },
        },
      }),

      /* Lớp mới tháng này */
      this.prismaService.courseClass.count({
        where: {
          createdAt: {
            gte: monthStart,
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
      this.prismaService.courseClassSession.findMany({
        take: RECENT_LIMIT,

        where: {
          startTime: {
            gte: todayStart,
            lte: todayEnd,
          },

          status: SessionStatus.SCHEDULED,
        },

        include: {
          courseClass: {
            include: {
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
          },
        },

        orderBy: {
          startTime: 'asc',
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

        todayClasses: todaySessions.map((session) => ({
          name: session.courseClass.name,

          teacher: session.courseClass.mainTeacher.user.fullName,

          totalStudents: session.courseClass._count.enrollments,

          time: `${formatDate(session.startTime, 'HH:mm')} - ${formatDate(session.endTime, 'HH:mm')}`,
        })),
      },
    );
  }
}

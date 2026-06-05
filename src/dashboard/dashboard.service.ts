import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { CourseStatus } from '@prisma/client';
// import { CustomResponse } from '../shared/utils/response';
// import { StatusCode } from '../shared/utils/status';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  // async getDashboardData() {
  //   const now = new Date();

  //   const startOfMonth = (date: Date) => {
  //     return new Date(date.getFullYear(), date.getMonth(), 1);
  //   };

  //   const [
  //     totalStudents,
  //     totalTeachers,
  //     activeCourses,
  //     totalRevenue,
  //     totalRevenueThisMonth,
  //     newStudentsThisMonth,
  //     newTeachersThisMonth,
  //     newCoursesThisMonth,
  //     recentEnrollments,
  //     todayCourses,
  //   ] = await Promise.all([
  //     this.prismaService.student.count(),

  //     this.prismaService.teacher.count(),

  //     this.prismaService.course.count({
  //       where: {
  //         status: CourseStatus.OPEN,
  //       },
  //     }),

  //     this.prismaService.enrollment.aggregate({
  //       _sum: {
  //         paidAmount: true,
  //       },
  //     }),

  //     /* So với tháng trước */
  //     this.prismaService.enrollment.aggregate({
  //       _sum: {
  //         paidAmount: true,
  //       },
  //       where: {
  //         enrolledAt: {
  //           gte: startOfMonth(now),
  //         },
  //       },
  //     }),

  //     this.prismaService.student.count({
  //       where: {
  //         joinedAt: {
  //           gte: startOfMonth(now),
  //         },
  //       },
  //     }),

  //     this.prismaService.teacher.count({
  //       where: {
  //         joinedAt: {
  //           gte: startOfMonth(now),
  //         },
  //       },
  //     }),

  //     this.prismaService.course.count({
  //       where: {
  //         createdAt: {
  //           gte: startOfMonth(now),
  //         },
  //         status: CourseStatus.OPEN,
  //       },
  //     }),

  //     this.prismaService.activityLog.findMany({
  //       orderBy: {
  //         createdAt: 'desc',
  //       },
  //     }),

  //     this.prismaService.course.findMany({
  //       where: {
  //         status: CourseStatus.OPEN,

  //         startDate: {
  //           lte: now,
  //         },
  //       },
  //       include: {
  //         teacher: {
  //           include: {
  //             user: true,
  //           },
  //         },
  //         _count: {
  //           select: {
  //             enrollments: true,
  //           },
  //         },
  //       },
  //       take: 10,
  //     }),
  //   ]);

  //   return CustomResponse(
  //     true,
  //     StatusCode.OK,
  //     'Lấy dữ liệu dashboard thành công',
  //     {
  //       statData: [
  //         {
  //           title: 'Tổng học viên',
  //           value: `${totalStudents} người`,
  //           extra: `+${newStudentsThisMonth}`,
  //         },

  //         {
  //           title: 'Lớp đang hoạt động',
  //           value: `${activeCourses} lớp`,
  //           extra: `+${newCoursesThisMonth}`,
  //         },

  //         {
  //           title: 'Giáo viên',
  //           value: `${totalTeachers} người`,
  //           extra: `+${newTeachersThisMonth}`,
  //         },

  //         {
  //           title: 'Doanh thu',
  //           value: `${totalRevenue._sum.paidAmount ?? 0} VND`,
  //           extra: `+${totalRevenueThisMonth._sum.paidAmount ?? 0}`,
  //         },
  //       ],

  //       recentActivityData: recentEnrollments.map((item) => ({
  //         type: item.type,
  //         title: item.title,
  //         message: item.description,
  //         date: item.createdAt,
  //       })),

  //       todayClasses: todayCourses.map((course) => ({
  //         name: `Khóa học: ${course.name}`,

  //         teacher: course.teacher?.user.fullName ?? 'Chưa phân công',

  //         totalStudents: course._count.enrollments,

  //         time: `${course.startTime} - ${course.endTime}`,
  //       })),
  //     },
  //   );
  // }
}

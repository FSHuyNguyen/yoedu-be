import { PrismaClient, Role, CourseLevel, CourseStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  /********************
   * 1. USERS
   ********************/
  const adminPassword = await bcrypt.hash('123456', 10);
  const staffPassword = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      password: adminPassword,
      fullName: 'System Admin',
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'staff@gmail.com' },
    update: {},
    create: {
      email: 'staff@gmail.com',
      password: staffPassword,
      fullName: 'Cashier Staff',
      role: Role.STAFF,
    },
  });

  /********************
   * 2. ROOM
   ********************/
  await prisma.room.createMany({
    data: [
      { roomCode: 'R001', name: 'Room A', capacity: 30 },
      { roomCode: 'R002', name: 'Room B', capacity: 35 },
      { roomCode: 'R003', name: 'Room C', capacity: 40 },
      { roomCode: 'R004', name: 'Room D', capacity: 45 },
      { roomCode: 'R005', name: 'Room E', capacity: 50 },
    ],
    skipDuplicates: true,
  });

  /********************
   * 3. SCHEDULE SLOT
   ********************/
  await prisma.scheduleSlot.createMany({
    data: [
      {
        slotCode: 'S1',
        weekday: 2, // Monday
        startTime: '08:00',
        endTime: '10:00',
      },
      {
        slotCode: 'S2',
        weekday: 3, // Tuesday
        startTime: '08:00',
        endTime: '10:00',
      },
      {
        slotCode: 'S3',
        weekday: 4, // Wednesday
        startTime: '18:00',
        endTime: '20:00',
      },
      {
        slotCode: 'S4',
        weekday: 5, // Thursday
        startTime: '08:00',
        endTime: '10:00',
      },
      {
        slotCode: 'S5',
        weekday: 6, // Friday
        startTime: '19:00',
        endTime: '21:00',
      },
      {
        slotCode: 'S6',
        weekday: 7, // Saturday
        startTime: '08:00',
        endTime: '10:00',
      },
      {
        slotCode: 'S7',
        weekday: 8, // Sunday
        startTime: '08:00',
        endTime: '10:00',
      },
    ],
    skipDuplicates: true,
  });

  /********************
   * 4. COURSE (optional demo)
   ********************/
  await prisma.course.upsert({
    where: { courseCode: 'C001' },
    update: {},
    create: {
      courseCode: 'C001',
      name: 'Basic English',
      level: CourseLevel.BEGINNER,
      status: CourseStatus.OPEN,
      totalSessions: 24,
    },
  });

  await prisma.course.upsert({
    where: { courseCode: 'C002' },
    update: {},
    create: {
      courseCode: 'C002',
      name: 'Basic Japanese',
      level: CourseLevel.BEGINNER,
      status: CourseStatus.OPEN,
      totalSessions: 48,
    },
  });

  console.log('Seed completed');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

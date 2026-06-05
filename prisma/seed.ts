import { PrismaClient, Role, CourseLevel, CourseStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  /********************
   * 1. USERS
   ********************/
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const staffPassword = await bcrypt.hash('Staff@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      password: adminPassword,
      fullName: 'System Admin',
      role: Role.ADMIN,
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@gmail.com' },
    update: {},
    create: {
      email: 'staff@gmail.com',
      password: staffPassword,
      fullName: 'Cashier Staff',
      role: Role.STAFF,
    },
  });

  console.log({ admin, staff });

  /********************
   * 2. ROOM
   ********************/
  await prisma.room.createMany({
    data: [
      { roomCode: 'R001', name: 'Room A', capacity: 30 },
      { roomCode: 'R002', name: 'Room B', capacity: 25 },
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
        weekday: 2,
        startTime: '08:00',
        endTime: '10:00',
      },
      {
        slotCode: 'S2',
        weekday: 4,
        startTime: '18:00',
        endTime: '20:00',
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
      tuitionFee: 1000000,
      status: CourseStatus.OPEN,
      totalSessions: 24,
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

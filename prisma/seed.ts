import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/* npx prisma db seed */
async function main() {
  const adminEmail = 'admin@gmail.com';

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existing) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: await bcrypt.hash('Admin@123', 10),
        fullName: 'System Admin',
        role: 'ADMIN',
      },
    });

    console.log('Admin created');
  }
}

main();

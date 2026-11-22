import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DIRECT_URL or DATABASE_URL environment variable is required to run seed.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminName = process.env.ADMIN_NAME?.trim() || 'Admin';
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables (.env) before seeding.'
    );
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      nama: adminName,
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      nama: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`Admin seeded: ${admin.email} (role: ${admin.role})`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

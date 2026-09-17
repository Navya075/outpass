import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with required users...');

  // Seed the four required users idempotently using upsert
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: { name: 'Alice Thorne', role: Role.AUTHOR },
    create: {
      email: 'alice@example.com',
      name: 'Alice Thorne',
      role: Role.AUTHOR,
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: { name: 'Bob Jenkins', role: Role.REVIEWER },
    create: {
      email: 'bob@example.com',
      name: 'Bob Jenkins',
      role: Role.REVIEWER,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { name: 'Charlie Admin', role: Role.ADMIN },
    create: {
      email: 'admin@example.com',
      name: 'Charlie Admin',
      role: Role.ADMIN,
    },
  });

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@example.com' },
    update: { name: 'Diana Viewer', role: Role.VIEWER },
    create: {
      email: 'viewer@example.com',
      name: 'Diana Viewer',
      role: Role.VIEWER,
    },
  });

  console.log('✅ Seeded required user accounts successfully:');
  console.table([
    { email: alice.email, name: alice.name, role: alice.role },
    { email: bob.email, name: bob.name, role: bob.role },
    { email: admin.email, name: admin.name, role: admin.role },
    { email: viewer.email, name: viewer.name, role: viewer.role },
  ]);

  console.log('🎉 Seed execution complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

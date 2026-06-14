const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@coverscart.com' },
    update: {
      role: 'ADMIN',
      password: hashedPassword
    },
    create: {
      email: 'admin@coverscart.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });
  console.log('Admin user created/updated:', admin.email);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

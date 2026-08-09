import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔌 Connecting to Render PostgreSQL database...');
    await prisma.$connect();
    console.log('✅ Connection successful!');
  } catch (err) {
    console.error('❌ Connection error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

async function main() {
  const connectionString = process.env.DATABASE_URL.replace('sslmode=require', 'sslmode=no-verify');
  const pool = new Pool({ 
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('Connecting to database...');
    const testimonials = await prisma.testimonial.findMany({ take: 1 });
    console.log('Successfully fetched testimonials:', testimonials.length);
    console.log('Prisma Client V7 is working correctly!');
  } catch (error) {
    console.error('Error testing Prisma Client:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();

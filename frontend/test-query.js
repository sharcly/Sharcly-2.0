const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

async function main() {
  const connectionString = process.env.DATABASE_URL?.replace("sslmode=require", "sslmode=no-verify");
  const pool = new Pool({ 
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('Testing Testimonials API Query...');
    const featuredOnly = false;
    const where = featuredOnly ? { featured: true } : {};
    
    console.log('Running findMany...');
    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [
        { featured: "desc" },
        { createdAt: "desc" },
      ],
      skip: 0,
      take: 10,
    });
    console.log('Successfully fetched testimonials:', testimonials.length);

    console.log('Running count...');
    const total = await prisma.testimonial.count({ where });
    console.log('Total count:', total);

  } catch (error) {
    console.error('Error testing query:', error);
    if (error.code) console.error('Error code:', error.code);
    if (error.meta) console.error('Error meta:', error.meta);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();

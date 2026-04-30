const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// Use the exact same connection logic as the app
const connectionString = (process.env.DATABASE_URL).replace("sslmode=require", "sslmode=no-verify");
const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const testimonials = [
  { name: "Sarah M.", role: "Customer", company: "Austin, TX", message: "I've tried a lot of CBD products and nothing compares. My sleep has genuinely improved and I feel so much calmer throughout the day.", rating: 5, featured: true },
  { name: "James R.", role: "Customer", company: "Denver, CO", message: "The Focus series is a game changer. Clean energy, no jitters. I use it every morning before my workouts and feel locked in.", rating: 4, featured: false },
  { name: "Priya L.", role: "Customer", company: "Seattle, WA", message: "I love that everything is lab tested and organic. I feel confident knowing exactly what's in every gummy. Highly recommend the Chill series.", rating: 5, featured: true },
  { name: "Marcus K.", role: "Customer", company: "Miami, FL", message: "Great flavor on the Delta-8 gummies. Took a bit longer to kick in than expected, but the relaxation was worth the wait.", rating: 5, featured: false },
  { name: "Elena G.", role: "Customer", company: "Portland, OR", message: "Finally found a night routine that works. No grogginess the next morning, just pure restful sleep. Sharcly is the real deal.", rating: 4, featured: false }
];

async function seed() {
  try {
    console.log('Seeding testimonials...');
    for (const t of testimonials) {
      // Check if already exists to avoid duplicates if run multiple times
      const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
      if (!existing) {
        await prisma.testimonial.create({ data: t });
        console.log(`Created testimonial for ${t.name}`);
      }
    }
    console.log('Successfully seeded testimonials');
  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

seed();

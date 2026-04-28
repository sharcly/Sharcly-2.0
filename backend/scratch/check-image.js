const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkImage() {
  const imageId = '00c777ed-a2fb-4950-96f2-544bdb378281';
  try {
    const image = await prisma.productImage.findUnique({
      where: { id: imageId }
    });

    if (!image) {
      console.log(`❌ Image ${imageId} not found in database.`);
      const allImages = await prisma.productImage.findMany({ take: 5 });
      console.log('Available images in DB:', allImages.map(img => img.id));
    } else {
      console.log(`✅ Image ${imageId} found!`);
      console.log(`   - MimeType: ${image.mimeType}`);
      console.log(`   - Data length: ${image.data ? image.data.length : 'NULL'}`);
    }
  } catch (err) {
    console.error('Prisma Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkImage();

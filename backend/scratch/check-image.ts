import { prisma } from "../src/common/lib/prisma";

async function checkImage() {
  const imageId = '00c777ed-a2fb-4950-96f2-544bdb378281';
  try {
    const image = await prisma.productImage.findUnique({
      where: { id: imageId }
    });

    if (!image) {
      console.log(`\n❌ Image ${imageId} not found in database.`);
      const allImages = await prisma.productImage.findMany({ take: 5, select: { id: true } });
      console.log('Available images in DB:', allImages.map(img => img.id));
    } else {
      console.log(`\n✅ Image ${imageId} found!`);
      console.log(`   - MimeType: ${image.mimeType}`);
      console.log(`   - Data present: ${image.data ? 'YES' : 'NO'}`);
      if (image.data) {
          console.log(`   - Data size: ${image.data.length} bytes`);
      }
    }
  } catch (err: any) {
    console.error('Prisma Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkImage();

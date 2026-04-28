import { prisma } from "../src/common/lib/prisma";

async function main() {
  const entries = await prisma.seoMeta.findMany();
  console.log("SeoMeta Entries:", JSON.stringify(entries, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

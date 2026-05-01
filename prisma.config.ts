import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.POSTGRES_URL_NON_POOLING || process.env.DIRECT_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL,
  },
});


// this is test push
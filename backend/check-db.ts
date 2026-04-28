import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  console.log("Connected to DB. Fetching columns for 'users' table...");
  const res = await client.query(`
    SELECT table_schema, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name LIKE '%role%';
  `);
  console.table(res.rows);
  await client.end();
}

main().catch(console.error);

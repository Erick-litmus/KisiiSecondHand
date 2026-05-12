import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const prismaClientSingleton = () => {
  // Use DIRECT_URL to bypass pgbouncer — Prisma's pg adapter needs a direct connection
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

  const pool = new pg.Pool({
    connectionString,
    max: 20,                         // Increased from 3 for better concurrency; Supabase free tier supports this
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 10000,  // 10s — enough for cold Supabase connections
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

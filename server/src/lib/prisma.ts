import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Setup the Connection Pool and Adapter
const connectionString = `${process.env.DATABASE_URL}`;

// 2. Extend global type for Singleton
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 3. Create the instance (reusing if exists)
export const prisma = globalForPrisma.prisma || (() => {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
})();

// 4. Save to global in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
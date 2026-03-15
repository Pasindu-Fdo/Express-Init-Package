import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function connectDB(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("MySQL (Prisma) connected successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
}

export default prisma;

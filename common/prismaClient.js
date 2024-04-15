import { PrismaClient } from "@prisma/client";

let prisma;

// Function to create and return the Prisma client instance
const getPrismaClient = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};

export default getPrismaClient();

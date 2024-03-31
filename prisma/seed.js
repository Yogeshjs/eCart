import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

async function main() {
  const saltRounds = +process.env.SALT_ROUNDS;
  const salt = await bcrypt.genSalt(saltRounds);

  const adminPassHash = await bcrypt.hash("admin@123", salt);
  const userPassHash = await bcrypt.hash("user@123", salt);

  const admin = await prisma.user.create({
    data: {
      name: "admin",
      email: "admin@gmail.com",
      password: adminPassHash,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "user",
      email: "user@gmail.com",
      password: userPassHash,
    },
  });

  console.log({ admin, user });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });

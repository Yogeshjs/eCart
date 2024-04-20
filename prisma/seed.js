import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

async function main() {
  const saltRounds = +process.env.SALT_ROUNDS;
  const salt = await bcrypt.genSalt(saltRounds);

  const adminPassHash = await bcrypt.hash("admin@123", salt);
  const userPassHash = await bcrypt.hash("user@123", salt);
  const user1PassHash = await bcrypt.hash("@123", salt);

  const tenant1 = await prisma.tenant.create({
    data: {
      name: "tenant1",
      plan: "BASIC",
    },
  });

  const tenant2 = await prisma.tenant.create({
    data: {
      name: "tenant2",
      plan: "ADVANCE",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "admin",
      email: "admin@gmail.com",
      password: adminPassHash,
      tenantId: tenant1.id,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "user",
      email: "user@gmail.com",
      password: userPassHash,
      tenantId: tenant2.id,
    },
  });

  console.log({ admin, user });
}

const user1 = await prisma.customer.create({
  data: {
    name: "user1",
    email: "user1@gmail.com",
    password: user1PassHash,
    tenantId: tenant1.id,
  },
});

// {
//   "name": "user1",
//   "email": "user1@gmail.com",
//   "password": "@123",
//   "tenantId": "clv0vhcs20000n37r8zx1mo2w"
// }

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });

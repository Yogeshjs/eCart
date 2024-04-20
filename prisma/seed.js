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

  const user1 = await prisma.customer.create({
    data: {
      name: "user1",
      email: "user1@gmail.com",
      password: user1PassHash,
      tenantId: tenant1.id,
    },
  });

  console.log({ admin, user, user1 });

  // products

  const prodouct1 = await prisma.product.create({
    data: {
      title: "Nokia",
      price: 99,
      stock: 10,
      category: "Mobile",
      thumbnail:
        "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEpSURBVHgB7ZbPEcFAFMY/pABHN9sBKqADSqACSqADHdABKuDoyNHJqoAO2LWbTGwi2ewfMyb5zXyzmSRv82Xf5uUBFWWnFjueMo2U6zumJTwSIN0Mh0CY2sIdDykt5kxPD5rFHxJkGDjJccFE4YYVxMoWMkCZ1rCnq8z7pp4RQCHy1YUbSFEDoQkCNwxMDJyZ+nBDh+mgnswzwN02pWzhqTzDwEAYbPvwJpTl/6UBoswXEWTHRZWrA7vNOPxmQIcN3FTAfdrkeSvAuclxAjsOMGQM8QZteCBvE3LCvPXgAR0DVI6uSvIHNc37rnKkMCe1uWlAD260BTsuTEf8KwSiHiQaCk9xCfgEd6kiPWJunM5XwIn/De/QxzQuAYFoyzYonoK1QVxFiXgBHOBc31ZnITQAAAAASUVORK5CYII=",
      tenantId: "clv0vhcs20000n37r8zx1mo2w",
    },
  });

  const prodouct2 = await prisma.product.create({
    data: {
      title: "Samsung",
      price: 199,
      stock: 10,
      category: "Mobile",
      thumbnail:
        "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFCSURBVHgB7ZbvbcIwEMVfu0DZoDdCRsgG7QawAd0Ab1CYADaADRATwAbABGGDcKechYUg9iXhE/5JTwL5nX3+c3aATObd+UjwlKwfFrFGrANrwTrd+aRtyioiPhP/rJpVsfasrf4XzQLfVD11xGdiph3M0czIQ6yVtkmCS/29fuBzgc8EaaBr8TjcZtnmm6unhAEfRBGfY/1FPLIqlfaZzFY1FHIuNo8aPluCRhiOC+sLhgTOiC+/BSnNEwwJSA3LCnyjP6R97SxBEhA73an4MiUYkUNYod9ZINZRkzAj+9bpEgnoPHuPvw/GsDPBQNsoNSxbURhiCtzej94Qmn1MTcIPfsSApUxBEm1X7/gVg4dJyJI+e2L9073HCwYPcTqQn2UZJGZ6cPow0QTqIJkSHUj5JHsGsX7RXFQy8wsymUwHrleiWa71wHGXAAAAAElFTkSuQmCC",
      tenantId: "clv0vhcs20000n37r8zx1mo2w",
    },
  });
}

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

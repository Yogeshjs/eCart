import express from "express";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../common/util.js";

import { isUserExist } from "../common/auth.middleware.js";
import prisma from "../common/prismaClient.js";

const tenantAuth = express.Router();

const saltRounds = +process.env.SALT_ROUNDS;

tenantAuth.put("/signup", [isUserExist], async (req, res) => {
  const { email, name, password, tenantId } = req.body;

  try {
    const salt = await bcrypt.genSalt(saltRounds);

    const hash = await bcrypt.hash(password, salt);

    // const checkUserExists = await prisma.user.count({
    //   where: {
    //     email,
    //   },
    // });

    // if (checkUserExists > 0) {
    //   res.json({ message: "email already exists" });
    //   return;
    // }

    console.log(email, password);

    const data = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        tenantId,
      },
    });

    res.json({ message: `User created as ${name} with mail id as ${email}` });
  } catch (error) {
    console.log("error ::", error);

    res.json({ reason: error.cause, message: error.message });
  }
});

tenantAuth.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user?.id) {
      res.status(401).json({
        message: "wrong username or password",
        is_authenticated: false,
      });

      return;
    }

    const storedPassword = user.password;

    const isAuthorised = await bcrypt.compare(password, storedPassword);

    if (!isAuthorised) {
      res.status(401).json({
        message: "wrong username or password",
        is_authenticated: false,
      });

      return;
    }

    const access_token = generateAccessToken(user);

    res.json({
      access_token,
      is_authenticated: true,
    });
  } catch (error) {
    console.log(error);

    res.json({ reason: error.cause, message: error.message });
  }
});

tenantAuth.get("/list", async (req, res) => {
  try {
    const tenants = await prisma.tenant.findMany();
    res.json({ tenants });
  } catch (error) {
    console.log(error);

    res.json({ reason: error.cause, message: error.message });
  }
});

export { tenantAuth };

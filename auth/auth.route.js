import express from "express";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../common/util.js";

import { isUserExist } from "../common/auth.middleware.js";
import prisma from "../common/prismaClient.js";

const auth = express.Router();

const saltRounds = +process.env.SALT_ROUNDS;

auth.put("/signup", [isUserExist], async (req, res) => {
  const { email, name, password, tenantId } = req.body;

  try {
    const salt = await bcrypt.genSalt(saltRounds);

    const hash = await bcrypt.hash(password, salt);

    // const checkUserExists = await prisma.customer.count({
    //   where: {
    //     email,
    //   },
    // });

    // if (checkUserExists > 0) {
    //   res.json({ message: "email already exists" });
    //   return;
    // }

    console.log(email, password);

    const data = await prisma.customer.create({
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

auth.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.customer.findUnique({
      where: {
        email,
      },
    });

    // user check

    if (!user?.id) {
      res.status(401).json({
        message: "wrong username or password",
        is_authenticated: false,
      });

      return;
    }

    const storedPassword = user.password;

    const isAuthorised = await bcrypt.compare(password, storedPassword);

    // user password check

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

export { auth };

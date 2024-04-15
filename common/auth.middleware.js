import { verifyAccessToken } from "./util.js";

import prisma from "../common/prismaClient.js";

globalThis;

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  const { success, data, error } = verifyAccessToken(token);

  if (!success) {
    return res.status(403).json({ error });
  }

  req.user = data;
  next();
};

export const isUserExist = async (req, res, next) => {
  const { email } = req.body;
  const checkUserExists = await prisma.customer.count({
    where: {
      email,
    },
  });

  if (checkUserExists > 0) {
    return res.status(409).json({ message: "email already exists" });
  }

  next();
};

import { verifyAccessToken } from "./util.js";

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

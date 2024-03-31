import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  const secretKey = process.env.JWT_SECRET;
  const jwtExpiry = process.env.JWT_EXP;

  const payload = {
    id: user.id,
    email: user.email,
  };

  const options = { expiresIn: jwtExpiry };

  return jwt.sign(payload, secretKey, options);
};

export const verifyAccessToken = (token) => {
  const secretKey = process.env.JWT_SECRET;

  try {
    const decodedData = jwt.verify(token, secretKey);
    return { success: true, data: decodedData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

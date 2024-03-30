import express from "express";

import { auth as authRouter } from "./auth/auth.route.js";

const app = express();
const port = process.env.PORT || 3000;

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello Check world !");
});

app.listen(port, () => {
  console.log(`Node service running on port ${port}`);
});

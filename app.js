import express from "express";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

import { auth as authRouter } from "./auth/auth.route.js";
import { products as productRouter } from "./product/product.route.js";
import { tenantAuth as tenantAuthRouter } from "./tenant/tenant.auth.route.js";

const port = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  limit: 20,
});

const app = express();
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(limiter);
app.use(cors());

app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/tenant/auth", tenantAuthRouter);

// health check api to test the service responding to the requrest
app.get("/healthCheck", (req, res) => {
  res.send("Hello Check world !");
});

app.listen(port, () => {
  console.log(`Node service running on port ${port}`);
});

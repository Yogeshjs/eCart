import express from "express";
import { authenticateToken } from "../common/auth.middleware.js";
import { PrismaClient } from "@prisma/client";
import { validateProduct, validationResult } from "./product.validator.js";

import multer from "multer";

// import prisma from '../common/prismaClient.js';

const prisma = new PrismaClient();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024,
  },
});

const products = express.Router();

products.get("/", [authenticateToken], async (req, res) => {
  const { user } = req;

  console.log("user ::", user);

  try {
    // const productsData = await fetch("https://dummyjson.com/products").then(
    //   (resp) => resp.json()
    // );

    const productsData = await prisma.product.findMany().then((products) =>
      products.map((product) => ({
        ...product,
        thumbnail: Buffer.from(product.thumbnail).toString("base64"),
      }))
    );

    res.json({
      data: productsData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

products.get("/:id", [authenticateToken], async (req, res) => {
  const { id } = req.params;

  try {
    const productData = await fetch(
      `https://dummyjson.com/products/${id}`
    ).then((resp) => resp.json());

    res.json({ data: productData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

products.put(
  "/",
  [upload.single("thumbnail"), validateProduct],
  async (req, res) => {
    // const { title, price, stock, category, thumbnail, tenantId } = req.body;

    const thumbnailImg = req.file?.buffer;

    if (!thumbnailImg) {
      return res.json({
        errors: [{ type: "field", msg: "thumbnail", path: "thumbnail" }],
      });
    }

    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    try {
      const data = await prisma.product.create({
        data: {
          ...req.body,
          thumbnail: thumbnailImg,
        },
      });

      res.json({
        ...data,
        thumbnail: Buffer.from(data.thumbnail).toString("base64"),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { products };

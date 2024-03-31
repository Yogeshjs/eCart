import express from "express";
import { authenticateToken } from "../common/auth.middleware.js";

const products = express.Router();

products.get("/", [authenticateToken], async (req, res) => {
  const { user } = req;

  console.log("user ::", user);

  try {
    const productsData = await fetch("https://dummyjson.com/products").then(
      (resp) => resp.json()
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

export { products };

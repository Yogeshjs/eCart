import express from "express";

const auth = express.Router();

auth.get("/", (req, res) => {
  res.json({
    name: "Tovin thomas",
  });
});

export { auth };

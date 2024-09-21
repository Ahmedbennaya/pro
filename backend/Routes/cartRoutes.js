import express from "express";
import { Router } from "express";
import {
  addProductsToCart,
  getAllProductsInCart,
  deleteProductFromCart,
} from "../Controllers/cartController.js";
import { authenticate } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:id", authenticate, addProductsToCart);
router.get("/", authenticate, getAllProductsInCart);
router.delete("/:id", authenticate, deleteProductFromCart);

export default router;
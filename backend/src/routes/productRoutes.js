import express from "express";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { createProduct, 
    getProducts, 
    getProduct, 
    getProductBySlug,
    updateProduct, 
    deleteProduct,
permanentlyDeleteProduct, } 
from "../controllers/productController.js";

const router = express.Router();
router.use(auth);
//router.post("/", createProduct);
router.post(
    "/",
    upload.single("image"),
    createProduct
);
router.get("/", getProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/id/:id", getProduct);
router.put(
    "/id/:id",
    upload.single("image"),
    updateProduct
);
router.delete("/id/:id", deleteProduct);
router.delete(
    "/id/:id/permanent",
    permanentlyDeleteProduct
);

export default router;
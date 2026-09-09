import express from "express";

import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

import {
    createProduct,
    getProducts,
    getProduct,
    getProductBySlug,
    updateProduct,
    deleteProduct,
    permanentlyDeleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Product Routes
|--------------------------------------------------------------------------
*/

router.get("/slug/:slug", getProductBySlug);


/*
|--------------------------------------------------------------------------
| Protected Admin Product Routes
|--------------------------------------------------------------------------
*/

router.use(auth);

router.post(
    "/",
    upload.fields([
        {
            name: "image",
            maxCount: 1,
        },
        {
            name: "galleryImages",
            maxCount: 20,
        },
    ]),
    createProduct
);

router.get("/", getProducts);

router.get("/id/:id", getProduct);

router.put(
    "/id/:id",
    upload.fields([
        {
            name: "image",
            maxCount: 1,
        },
        {
            name: "galleryImages",
            maxCount: 20,
        },
    ]),
    updateProduct
);

router.delete(
    "/id/:id",
    deleteProduct
);

router.delete(
    "/id/:id/permanent",
    permanentlyDeleteProduct
);

export default router;
import express from "express";

import {
    getPublicCategories,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get(
    "/categories",
    getPublicCategories
);

export default router;
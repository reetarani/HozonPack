import express from "express";

import {
    getPublicIndustries,
    getIndustryBySlug,
} from "../controllers/industryController.js";

import {
    getPublicProductsByIndustry,
} from "../controllers/productController.js";

const router = express.Router();

router.get(
    "/",
    getPublicIndustries
);

// Products belonging to an industry
router.get(
    "/:slug/products",
    getPublicProductsByIndustry
);

router.get(
    "/:slug",
    getIndustryBySlug
);

export default router;
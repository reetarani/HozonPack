import express from "express";

import {
    getPublicSeoMeta,
} from "../controllers/seoMetaController.js";

const router = express.Router();

router.get(
    "/seo-meta",
    getPublicSeoMeta
);

export default router;
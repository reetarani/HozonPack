import express from "express";

import auth from "../middleware/authMiddleware.js";

import {
    getSeoMeta,
    getSeoMetaById,
    createSeoMeta,
    updateSeoMeta,
    deleteSeoMeta,
    permanentlyDeleteSeoMeta,
} from "../controllers/seoMetaController.js";

const router = express.Router();

router.use(auth);

router.get(
    "/",
    getSeoMeta
);

router.get(
    "/id/:id",
    getSeoMetaById
);

router.post(
    "/",
    createSeoMeta
);

router.put(
    "/id/:id",
    updateSeoMeta
);

router.delete(
    "/id/:id",
    deleteSeoMeta
);

router.delete(
    "/id/:id/permanent",
    permanentlyDeleteSeoMeta
);

export default router;
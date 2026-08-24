import express from "express";

import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

import {
    createHero,
    getHeroes,
    getHero,
    updateHero,
    deleteHero,
} from "../controllers/heroController.js";

const router = express.Router();

router.use(auth);

router.post(
    "/",
    upload.single("image"),
    createHero
);

router.get(
    "/",
    getHeroes
);

router.get(
    "/:id",
    getHero
);

router.put(
    "/:id",
    upload.single("image"),
    updateHero
);

router.delete(
    "/:id",
    deleteHero
);

export default router;
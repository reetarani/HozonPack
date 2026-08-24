import express from "express";

import {
    getPublicHero,
} from "../controllers/heroController.js";

const router = express.Router();

router.get(
    "/hero",
    getPublicHero
);

export default router;
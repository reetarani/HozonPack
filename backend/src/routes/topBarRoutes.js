import express from "express";

import {
    getPublicTopBar,
    getTopBars,
    getTopBar,
    createTopBar,
    updateTopBar,
    deleteTopBar,
} from "../controllers/topBarController.js";

import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/public", getPublicTopBar);

// Admin
router.get("/", auth, getTopBars);
router.get("/:id", auth, getTopBar);
router.post("/", auth, createTopBar);
router.put("/:id", auth, updateTopBar);
router.delete("/:id", auth, deleteTopBar);

export default router;
import express from "express";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

import {
    createTestimonial,
    getTestimonials,
    getTestimonial,
    updateTestimonial,
    deleteTestimonial
} from "../controllers/testimonialController.js";

const router = express.Router();

router.use(auth);

router.post(
    "/",
    upload.single("image"),
    createTestimonial
);

router.get("/", getTestimonials);

router.get("/:id", getTestimonial);

router.put(
    "/:id",
    upload.single("image"),
    updateTestimonial
);

router.delete("/:id", deleteTestimonial);

export default router;
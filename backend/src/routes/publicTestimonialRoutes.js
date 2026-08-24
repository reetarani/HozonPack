import express from "express";

import {
    getPublicTestimonials,
} from "../controllers/testimonialController.js";

const router = express.Router();

router.get(
    "/testimonials",
    getPublicTestimonials
);

export default router;
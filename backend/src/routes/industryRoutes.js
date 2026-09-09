import express from "express";

import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

import {
    createIndustry,
    updateIndustry,
    getIndustries,
    getIndustryBySlug,
    getIndustryById,
    deleteIndustry,
    permanentlyDeleteIndustry,
} from "../controllers/industryController.js";


const router = express.Router();


// =====================================================
// ADMIN ROUTES
// =====================================================

router.use(auth);


// Create

router.post(
    "/",
    upload.single("image"),
    createIndustry
);


// Get all

router.get(
    "/",
    getIndustries
);


// Get by ID

router.get(
    "/id/:id",
    getIndustryById
);


// Update

router.put(
    "/id/:id",
    upload.single("image"),
    updateIndustry
);


// Soft delete

router.delete(
    "/id/:id",
    deleteIndustry
);


// Permanent delete

router.delete(
    "/id/:id/permanent",
    permanentlyDeleteIndustry
);


// =====================================================
// PUBLIC SLUG ROUTE
// =====================================================
//
// IMPORTANT:
// If this route is behind auth, customer frontend
// will not be able to access it.
//
// Prefer keeping the public route in your
// publicIndustryRoutes.js.
//
// This route is shown here only if your architecture
// intentionally exposes it without auth.
// =====================================================


// router.get(
//     "/public/industries/:slug",
//     getIndustryBySlug
// );


export default router;
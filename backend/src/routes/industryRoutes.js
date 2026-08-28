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

router.use(auth);
router.post(
    "/",
    upload.single("image"),
    createIndustry
);


router.get(
    "/",
    getIndustries
);


router.get(
    "/id/:id",
    getIndustryById
);


router.put(
    "/id/:id",
    upload.single("image"),
    updateIndustry
);


router.delete(
    "/id/:id",
    deleteIndustry
);

router.delete(
    "/id/:id/permanent",
    permanentlyDeleteIndustry
);

router.get("/public/industries/:slug", getIndustryBySlug);
export default router;
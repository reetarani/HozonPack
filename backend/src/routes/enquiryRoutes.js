import express from "express";

import auth from "../middleware/authMiddleware.js";

import {
    createEnquiry,
    getEnquiries,
    getAllEnquiries,
    getEnquiryById,
    markEnquiryAsRead,
    deleteEnquiry,
    permanentlyDeleteEnquiry,
} from "../controllers/enquiryController.js";

const router = express.Router();

router.use(auth);

// Create enquiry
router.post("/", createEnquiry);

// Get combined enquiries
// Product Enquiry + Corporate Quote
router.get("/all", getAllEnquiries);

// Get normal enquiries only
router.get("/", getEnquiries);

// Get single enquiry
router.get("/id/:id", getEnquiryById);

router.put(
    "/id/:id/read",
    markEnquiryAsRead
);

router.delete(
    "/id/:id",
    deleteEnquiry
);

router.delete(
    "/id/:id/permanent",
    permanentlyDeleteEnquiry
);

export default router;
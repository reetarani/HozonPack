import express from "express";

import {
    createCorporateQuote,
    getCorporateQuotes,
    getCorporateQuote,
    markCorporateQuoteAsRead,
    deleteCorporateQuote,
    permanentlyDeleteCorporateQuote,
} from "../controllers/corporateQuoteController.js";

import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/", createCorporateQuote);

// Admin
router.get("/", auth, getCorporateQuotes);

router.get("/:id", auth, getCorporateQuote);

router.patch(
    "/:id/read",
    auth,
    markCorporateQuoteAsRead
);

router.patch(
    "/:id/deactivate",
    auth,
    deleteCorporateQuote
);

router.delete(
    "/:id/permanent",
    auth,
    permanentlyDeleteCorporateQuote
);

export default router;
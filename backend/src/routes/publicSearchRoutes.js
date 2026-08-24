import express from "express";

import {
    publicSearch,
    getSearchSuggestions,
} from "../controllers/searchController.js";

const router = express.Router();

router.get("/search", publicSearch);

router.get(
    "/search/suggestions",
    getSearchSuggestions
);

export default router;
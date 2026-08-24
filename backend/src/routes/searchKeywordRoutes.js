import express from "express";

import auth from "../middleware/authMiddleware.js";

import {
    getSearchKeywords,
    getSearchKeyword,
    deleteSearchKeyword,
    permanentlyDeleteSearchKeyword,
} from "../controllers/searchKeywordController.js";

const router = express.Router();

router.use(auth);

router.get(
    "/",
    getSearchKeywords
);

router.get(
    "/id/:id",
    getSearchKeyword
);

router.delete(
    "/id/:id",
    deleteSearchKeyword
);

router.delete(
    "/id/:id/permanent",
    permanentlyDeleteSearchKeyword
);

export default router;
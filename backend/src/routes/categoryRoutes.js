import express from "express";
import auth from "../middleware/authMiddleware.js";
import { createCategory, getCategories,
    getCategoryById,
    getCategoryBySlug,
    updateCategory,
    deleteCategory,
permanentlyDeleteCategory,
} 
from "../controllers/categoryController.js";

const router = express.Router();
router.use(auth);
router.post("/", createCategory);
router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);
router.get("/id/:id", getCategoryById);
router.put("/:id", updateCategory);
// Soft delete
router.delete("/id/:id", deleteCategory);

// Permanent delete - inactive only
router.delete(
    "/id/:id/permanent",
    permanentlyDeleteCategory
);

export default router;
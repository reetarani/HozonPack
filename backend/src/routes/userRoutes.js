import express from "express";
import auth from "../middleware/authMiddleware.js";

import {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
} from "../controllers/userController.js";

const router = express.Router();

router.use(auth);

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
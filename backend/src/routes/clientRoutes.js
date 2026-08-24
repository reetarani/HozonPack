import express from "express";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

import {
    createClient,
    getClients,
    getClient,
    updateClient,
    deleteClient,
} from "../controllers/clientController.js";

const router = express.Router();

router.use(auth);

router.post(
    "/",
    upload.single("logo"),
    createClient
);

router.get("/", getClients);

router.get("/:id", getClient);

router.put(
    "/:id",
    upload.single("logo"),
    updateClient
);

router.delete("/:id", deleteClient);

export default router;
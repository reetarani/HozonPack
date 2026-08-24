import express from "express";
import {
    getPublicClients,
} from "../controllers/clientController.js";

const router = express.Router();

router.get("/clients", getPublicClients);

export default router;
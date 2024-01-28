import { Router } from "express";
const router = Router();

// Import controllers
import Status from "../controllers/api-status.controller.js";

// Endpoint http://localhost:5000/check/status
// Method GET
// Access Public
router.get("/check/status", Status.ApiStatus);

export default router;

import { Router } from "express";
const router = Router();
import AdminMiddleware from "../middlewares/admin.middleware.js";

// Import controllers
import AdminController from "../controllers/admin/admin.controller.js";

// Endpoint http://localhost:5000/admin/current
// Method POST
// Access public
router.post("/admin/current", AdminMiddleware.checkToken, AdminController.CurrentAdmin);

export default router;

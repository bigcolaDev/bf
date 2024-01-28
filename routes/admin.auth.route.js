import { Router } from "express";
const router = Router();

// Import controllers
import AuthController from "../controllers/admin/auth.controller.js";

import AdminMiddleware from "../middlewares/admin.middleware.js";

// Endpoint http://localhost:5000/admin/signup
// Method POST
// Access Public
router.post("/admin/signup", AuthController.Signup);

// Endpoint http://localhost:5000/admin/signin
// Method POST
// Access Public
router.post("/admin/signin", AuthController.Signin);

// Endpoint http://localhost:5000/admin/authen
// Method GET
// Access Public
router.get("/admin/authen", AdminMiddleware.checkToken, AuthController.AdminToken); 

export default router;

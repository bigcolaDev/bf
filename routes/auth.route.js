import { Router } from "express";
const router = Router();

import AdminMiddleware from "../middlewares/admin.middleware.js";
import UserMiddleware from "../middlewares/user.middleware.js";

// Import controllers
import AuthController from "../controllers/auth.controller.js";

// Endpoint http://localhost:5000/api/v1/auth/register
// Method POST
// Access Public
router.post("/auth/register", AuthController.Register);

// AddUser
// Endpoint http://localhost:5000/api/v1/auth/add/user
// Method POST
// Access Public
router.post("/auth/add/user", AdminMiddleware.checkToken, AuthController.AddUser);

// Endpoint http://localhost:5000/api/v1/auth/login
// Method POST
// Access Public
router.post("/auth/login", AuthController.Login);

// Endpoint http://localhost:5000/api/v1/authen
// Method GET
// Access Public
router.get("/authen", UserMiddleware.checkToken, AuthController.UserToken);

export default router;

import { Router } from "express";
const router = Router();
import UserMiddleware from "../middlewares/user.middleware.js";
import AdminMiddleware from "../middlewares/admin.middleware.js";

// Import controllers
import CodeController from "../controllers/code-credit.controller.js";

// Endpoint http://localhost:5000/api/v1/code/create
// Method POST
// Access Private
router.post("/code/create", AdminMiddleware.checkToken, CodeController.Create);

// Endpoint http://localhost:5000/api/v1/code/list
// Method GET
// Access Private
router.get("/code/list", AdminMiddleware.checkToken, CodeController.List);

// Endpoint http://localhost:5000/api/v1/code/clear
// Method DELETE
// Access Private
router.delete("/code/clear", CodeController.Clear);

// Endpoint http://localhost:5000/api/v1/code/check
// Method POST
// Access Private
router.post("/code/check", UserMiddleware.checkToken, CodeController.Check);

export default router;
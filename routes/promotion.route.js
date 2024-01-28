import { Router } from "express";
const router = Router();

// Import controllers
import PromotionController from "../controllers/promotion.controller.js";

//Middleware
import AdminMiddleware from "../middlewares/admin.middleware.js";
import UserMiddleware from "../middlewares/user.middleware.js";

// Endpoint http://localhost:5000/promotion/create
// Method POST
// Access Private
router.post("/promotion/create", AdminMiddleware.checkToken, PromotionController.Create);

// Endpoint http://localhost:5000/promotion/get/all
// Method GET
// Access Private
router.get("/promotion/get/all", PromotionController.GetAll);

// Endpoint http://localhost:5000/promotion/deposit/count
// Method POST
// Access Private
router.post("/promotion/deposit/count", AdminMiddleware.checkToken, PromotionController.DepositProCount);

// Endpoint http://localhost:5000/promotion/delete
// Method POST
// Access Private
router.post("/promotion/delete", AdminMiddleware.checkToken, PromotionController.Delete);

// Endpoint http://localhost:5000/promotion/update
// Method POST
// Access Private
router.post("/promotion/update", AdminMiddleware.checkToken, PromotionController.Update);

// Endpoint http://localhost:5000/promotion/create/with/user
// Method POST
// Access Private
router.post("/promotion/create/with/user", UserMiddleware.checkToken, PromotionController.CreatePromotionWithUser);

export default router;

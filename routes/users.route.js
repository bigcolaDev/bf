import { Router } from "express";
const router = Router();
import UserMiddleware from "../middlewares/user.middleware.js";
import AdminMiddleware from "../middlewares/admin.middleware.js";

// Import controllers
import UsersController from "../controllers/users.controller.js";

// Endpoint http://localhost:5000/api/v1/users
// Method GET
// Access Private
router.get("/users", AdminMiddleware.checkToken, UsersController.Users);

// Endpoint http://localhost:5000/api/v1/users/current
// Method POST
// Access Private
router.post(
	"/users/current",
	UserMiddleware.checkToken,
	UsersController.CurrentUser,
);

// Endpoint http://localhost:5000/api/v1/agent/balance
// Method GET
// Access Private
router.get("/agent/balance", UsersController.AgentBalance);

// Endpoint http://localhost:5000/api/v1/users/balance 
// Method POST
// Access Private
router.post(
	"/users/balance",
	UserMiddleware.checkToken,
	UsersController.UserBalance,
);

// Endpoint http://localhost:5000/api/v1/users/edit
// Method POST
// Access Private
router.post("/users/edit", AdminMiddleware.checkToken, UsersController.EditUser); 

// Endpoint http://localhost:5000/api/v1/users/status/update
// Method POST
// Access Private
router.post("/users/status/update", AdminMiddleware.checkToken, UsersController.UpdateStatus);

// Endpoint http://localhost:5000/api/v1/users/password/change
// Method POST
// Access Private
router.post("/users/password/change", UsersController.ChangePassword);

// Endpoint http://localhost:5000/api/v1/users/commission
// Method POST
// Access Private
router.post(
	"/users/commission",
	UserMiddleware.checkToken,
	UsersController.Commission,
);

// Endpoint http://localhost:5000/api/v1/users/commission/setting
// Method POST
// Access Private
router.post("/users/commission/setting", UsersController.CommissionSetting);

// Endpoint http://localhost:5000/api/v1/users/ref1
// Method POST
// Access Private
router.post("/users/ref1", UserMiddleware.checkToken, UsersController.Ref1);

// Endpoint http://localhost:5000/api/v1/users/ref2
// Method POST
// Access Private
router.post("/users/ref2", UserMiddleware.checkToken, UsersController.Ref2);

// Endpoint http://localhost:5000/api/v1/users/summary
// Method POST
// Access Private
router.post("/users/summary", UserMiddleware.checkToken, UsersController.Summary);

// Endpoint http://localhost:5000/api/v1/users/receive/commission 
// Method POST
// Access Private
router.post(
	"/users/receive/commission",
	UserMiddleware.checkToken,
	UsersController.CommissionReceive,
);

// Endpoint http://localhost:5000/api/v1/users/receive/cashback
// Method POST
// Access Private
router.post(
	"/users/receive/cashback",
	UserMiddleware.checkToken,
	UsersController.CashbackReceive,
);

// Endpoint http://localhost:5000/api/v1/users/receive/recommend
// Method POST
// Access Private
router.post(
	"/users/receive/recommend",
	UserMiddleware.checkToken,
	UsersController.RecommendReceive,
);

// Endpoint http://localhost:5000/api/v1/users/logs
// Method POST
// Access Private
router.post("/users/logs", UserMiddleware.checkToken, UsersController.LogsWithUser);

// Endpoint http://localhost:5000/api/v1/users/logs/all
// Method GET
// Access Public
router.get("/users/logs/all", UsersController.Logs);

export default router;

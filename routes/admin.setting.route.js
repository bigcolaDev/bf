import { Router } from "express";
const router = Router();
import AdminMiddleware from "../middlewares/admin.middleware.js"

// Import controllers
import SettingController from "../controllers/admin/setting.controller.js";

// Endpoint http://localhost:5000/api/v1/setting
// Method GET
// Access Public
router.post("/setting", SettingController.Setting);

// Endpoint http://localhost:5000/api/v1/admin/setting/logo/create
// Method POST
// Access Private
router.post("/admin/setting/logo/create", AdminMiddleware.checkToken, SettingController.CreateLogo);

// Endpoint http://localhost:5000/api/v1/admin/setting/playgame/create
// Method POST
// Access Private
router.post("/admin/setting/playgame/create", AdminMiddleware.checkToken, SettingController.CreatePlayGame);

// Endpoint http://localhost:5000/api/v1/admin/setting/contact/create
// Method POST
// Access Private
router.post("/admin/setting/contact/create", AdminMiddleware.checkToken, SettingController.CreateContact); 

// Endpoint http://localhost:5000/api/v1/admin/setting/limit/deposit-withdraw/create
// Method POST
// Access Private
router.post("/admin/setting/limit/deposit-withdraw/create", AdminMiddleware.checkToken, SettingController.CreateLimitDepositAndWithdraw);

// Endpoint http://localhost:5000/api/v1/admin/setting/news/create
// Method POST
// Access Private
router.post("/admin/setting/news/create", AdminMiddleware.checkToken, SettingController.CreateNews);


// Endpoint http://localhost:5000/api/v1/admin/setting/referral/create
// Method POST
// Access Private
router.post("/admin/setting/referral/create", AdminMiddleware.checkToken, SettingController.CreateSettingReferral);

// Endpoint http://localhost:5000/api/v1/admin/setting/minigame/create
// Method POST
// Access Private
router.post("/admin/setting/minigame/create", AdminMiddleware.checkToken, SettingController.CreateSettingMiniGame);

// Endpoint http://localhost:5000/api/v1/admin/setting/commission/create
// Method POST
// Access Private
router.post("/admin/setting/commission/create", AdminMiddleware.checkToken, SettingController.CreateSettingCommission);

// Endpoint http://localhost:5000/api/v1/admin/setting/cashback/create
// Method POST
// Access Private
router.post("/admin/setting/cashback/create", AdminMiddleware.checkToken, SettingController.CreateSettingCashback); 

export default router;

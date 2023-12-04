import { Router } from "express";
const router = Router();

// Import controllers
import SmsOtpController from "../controllers/sms-otp.controller.js";

// Endpoint http://localhost:5000/api/v1/sms-otp/send
// Method POST
// Access Public
router.post("/sms-otp/send", SmsOtpController.Send);

// Endpoint http://localhost:5000/api/v1/sms-otp/verify
// Method POST
// Access Public
router.post("/sms-otp/verify", SmsOtpController.Verify);

export default router;

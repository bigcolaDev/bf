import { Router } from "express";
const router = Router();
import AdminMiddleware from "../middlewares/admin.middleware.js";

// Import controllers
import BankController from "../controllers/bank.controller.js";

// Endpoint http://localhost:5000/api/v1/transaction/bank/scb
// Method GET
// Access Private
router.get("/transaction/bank/scb", AdminMiddleware.checkToken, BankController.GetTransactionBankScb);

// Endpoint http://localhost:5000/api/v1/transaction/topup
// Method GET
// Access Private
router.get("/transaction/topup", AdminMiddleware.checkToken, BankController.GetTransactionTopup);

// Endpoint http://localhost:5000/api/v1/add/account-bank
// Method POST
// Access public
router.post("/add/account-bank", AdminMiddleware.checkToken, BankController.AddAccountBank);

// Endpoint http://localhost:5000/api/v1/account/bank/lists
// Method GET
// Access public
router.get("/account/bank/lists", BankController.GetAccountBank);

// Endpoint http://localhost:5000/api/v1/update/status-account-bank
// Method POST
// Access private
router.post("/update/status-account-bank", AdminMiddleware.checkToken, BankController.UpdateStatusAccountBank);

// Endpoint http://localhost:5000/api/v1/update/account-bank
// Method POST
// Access private
router.post("/update/account-bank", AdminMiddleware.checkToken, BankController.UpdateAccountBank); 

// Endpoint http://localhost:5000/api/v1/delete/account-bank
// Method POST
// Access private
router.post("/delete/account-bank", AdminMiddleware.checkToken, BankController.DeleteAccountBank); 


export default router; 

import { Router } from "express";
const router = Router();
import UserMiddleware from "../middlewares/user.middleware.js";
import AdminMiddleware from "../middlewares/admin.middleware.js";

// Import controllers
import TransferController from "../controllers/transfer.controller.js";

// Balance
// Endpoint http://localhost:5000/api/v1/transfer/balance
// Method GET
// Access Private
router.get("/transfer/balance", AdminMiddleware.checkToken, TransferController.Balance);

// Deposit
// Endpoint http://localhost:5000/api/v1/transfer/deposit
// Method POST
// Access Public
// router.post("/transfer/deposit", UserMiddleware.checkToken, TransferController.Deposit); 

// Endpoint http://localhost:5000/api/v1/transfer/detect-bank-account
// Method POST
// Access Public
router.post(
	"/transfer/detect-bank-account",
	AdminMiddleware.checkToken,
	TransferController.DetectBankAccount,
);

// Endpoint http://localhost:5000/api/v1/hanlder/transfer 
// Method POST
// Access Private
router.post(
	"/hanlder/transfer",
	AdminMiddleware.checkToken,
	TransferController.HanlderTransfer,
);

// Endpoint http://localhost:5000/api/v1/hanlder/transfer/list
// Method GET
// Access Private
router.get(
	"/hanlder/transfer/list",
	AdminMiddleware.checkToken,
	TransferController.HanlderTransferList,
);

// Endpoint http://localhost:5000/api/v1/transfer/deposit/hanlder
// Method POST
// Access Private
router.post(
	"/transfer/deposit/hanlder",
	AdminMiddleware.checkToken,
	TransferController.HanlderDeposit,
);

// Endpoint http://localhost:5000/api/v1/transfer/withdraw/hanlder
// Method POST
// Access Private
router.post(
	"/transfer/withdraw/hanlder",
	AdminMiddleware.checkToken,
	TransferController.HanlderWithdraw,
);

// Endpoint http://localhost:5000/api/v1/transfer/list/deposit
// Method POST
// Access Private
router.post(
	"/transfer/list/deposit",
	UserMiddleware.checkToken,
	TransferController.DepositWithUser,
);

// Deposit
// Endpoint http://localhost:5000/api/v1/list/deposit  
// Method GET
// Access Private
router.get(
	"/list/deposit",
	AdminMiddleware.checkToken,
	TransferController.DepositList,
);

// Endpoint http://localhost:5000/api/v1/transfer/withdraw
// Method POST
// Access Public
router.post("/transfer/withdraw", UserMiddleware.checkToken, TransferController.Withdraw);


// Endpoint http://localhost:5000/api/v1/list/withdraw
// Method POST
// Access Private
router.post(
	"/list/withdraw",
	UserMiddleware.checkToken,
	TransferController.WithdrawWithUser,
);

// withdrawList
// Endpoint http://localhost:5000/api/v1/list/withdraw/all
// Method GET
// Access Private
router.get(
	"/list/withdraw/all",
	AdminMiddleware.checkToken,
	TransferController.withdrawList,
);

//Endpoint http://localhost:5000/api/v1/history/transfers
// Method POST
// Access Public
router.post("/history/transfers", TransferController.TransferHistory); 

//Endpointhttp://localhost:5000/api/v1/history/transfers/all
// Method POST
// Access Private
router.post(
	"/history/transfers/all",
	UserMiddleware.checkToken,
	TransferController.TransferHistoryAll,
);

// Endpoint http://localhost:5000/api/v1/transfer/deposit/create
// Method POST
// Access Private
router.post(
	"/transfer/deposit/create",
	AdminMiddleware.checkToken,
	TransferController.CreateDeposit,
);

// Endpoint http://localhost:5000/api/v1/transfer/withdraw/create
// Method POST
// Access Private
router.post(
	"/transfer/withdraw/create",
	AdminMiddleware.checkToken,
	TransferController.CreateWithdraw,
);

// Endpoint http://localhost:5000/api/v1/transfer/deposit/list
// Method GET
// Access Private
router.get(
	"/transfer/deposit/list",
	AdminMiddleware.checkToken,
	TransferController.CreateDepositList,
);

// Endpoint http://localhost:5000/api/v1/transfer/withdraw/list
// Method GET
// Access Private
router.get(
	"/transfer/withdraw/list",
	AdminMiddleware.checkToken,
	TransferController.CreateWithdrawList,
);

export default router;

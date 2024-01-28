import { Router } from "express";
const router = Router();
import AdminMiddleware from "../middlewares/admin.middleware.js";

// Import controller
import EmployeeController from "../controllers/employee.controller.js"; 

// Endpoint http://localhost:5000/employee/create
// Method POST
// Access Private
router.post("/employee/create", AdminMiddleware.checkToken, EmployeeController.Create);

// Endpoint http://localhost:5000/employees
// Method GET
// Access Private
router.get("/employees", AdminMiddleware.checkToken, EmployeeController.Employees);

// Endpoint http://localhost:5000/employee/delete
// Method POST
// Access Private
router.post("/employee/delete", AdminMiddleware.checkToken, EmployeeController.Delete);

// Endpoint http://localhost:5000/employee/status/update
// Method POST
// Access Private
router.post("/employee/status/update", AdminMiddleware.checkToken, EmployeeController.UpdateStatus);

// Endpoint http://localhost:5000/employee/update
// Method POST
// Access Private
router.post("/employee/update", AdminMiddleware.checkToken, EmployeeController.Update);

export default router;
/** @format */

import express from "express";
import { EmployeeController } from "../controllers/employeeController";

const router = express.Router();

const employeeController = new EmployeeController();

router.post("/", employeeController.createEmployee);
router.get("/:employeeId", employeeController.getEmployee);
router.get("/", employeeController.listEmployees);

export default router;

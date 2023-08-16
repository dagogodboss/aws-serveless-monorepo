"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const employeeService_1 = __importDefault(require("../services/employeeService"));
class EmployeeController {
    constructor(docClient, tableName, emitter) {
        this.employeeService = new employeeService_1.default(docClient, tableName);
    }
    async createEmployee(event, context) {
        try {
            const employeeData = JSON.parse(event.body || "{}");
            const employee = await this.employeeService.createEmployee(employeeData);
            return {
                statusCode: 201,
                body: JSON.stringify(employee),
            };
        }
        catch (error) {
            console.error("Error creating employee:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal server error" }),
            };
        }
    }
    async getEmployee(event, context) {
        var _a;
        try {
            const employeeId = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.employeeId;
            if (!employeeId) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: "Missing employeeId in the path" }),
                };
            }
            const employee = await this.employeeService.getEmployee(employeeId);
            if (!employee) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: "Employee not found" }),
                };
            }
            return {
                statusCode: 200,
                body: JSON.stringify(employee),
            };
        }
        catch (error) {
            console.error("Error fetching employee:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal server error" }),
            };
        }
    }
    async listEmployees(event, context) {
        try {
            const employees = await this.employeeService.listEmployees();
            return {
                statusCode: 200,
                body: JSON.stringify(employees),
            };
        }
        catch (error) {
            console.error("Error fetching employees:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal server error" }),
            };
        }
    }
    async createEmployeesFromExcel(event, context) {
        try {
            const file = (event === null || event === void 0 ? void 0 : event.body) || null;
            if (!file) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: "Missing Excel file in the request",
                    }),
                };
            }
            const employees = await this.employeeService.createEmployeesFromExcel(file);
            return {
                statusCode: 201,
                body: JSON.stringify(employees),
            };
        }
        catch (error) {
            console.error("Error creating employees from Excel:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal server error" }),
            };
        }
    }
}
exports.EmployeeController = EmployeeController;

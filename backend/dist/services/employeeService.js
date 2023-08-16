"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const excelParser_1 = require("../utils/excelParser");
class EmployeeService {
    constructor(docClient, tableName) {
        this.docClient = docClient;
        this.tableName = tableName;
    }
    async createEmployee(employee) {
        const params = {
            TableName: this.tableName,
            Item: employee,
        };
        await this.docClient.put(params).promise();
        return employee;
    }
    async getEmployee(employeeId) {
        const params = {
            TableName: this.tableName,
            Key: { employeeId },
        };
        const result = await this.docClient.get(params).promise();
        return result.Item;
    }
    async listEmployees() {
        const params = {
            TableName: this.tableName,
        };
        const result = await this.docClient.scan(params).promise();
        return result.Items;
    }
    async createEmployeesFromExcel(file) {
        try {
            const employees = [];
            // Assuming readExcelFile is a function that parses the Excel file and returns the data as an array
            const data = (0, excelParser_1.readExcelFile)(file);
            // Process the data and create employees
            for (const row of data) {
                const employee = {
                    role: row.role,
                    employeeId: row.employeeId,
                    name: row.name,
                    email: row.email,
                    department: row.department,
                    createdAt: new Date().toISOString(),
                };
                await this.createEmployee(employee);
                employees.push(employee);
            }
            return employees;
        }
        catch (error) {
            console.error("Error creating employees from Excel:", error);
            throw new Error("Failed to create employees from Excel");
        }
    }
}
exports.default = EmployeeService;

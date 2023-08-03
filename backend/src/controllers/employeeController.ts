import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import EmployeeService from "../services/employeeService";
import Employee from "../models/Employee";
import { EventEmitter } from 'events';

class EmployeeController {
  private readonly employeeService: EmployeeService;

  constructor(
    docClient: DocumentClient,
    tableName: string,
    emitter: EventEmitter,
  ) {
    this.employeeService = new EmployeeService(docClient, tableName);
  }

  async createEmployee(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    try {
      const employeeData = JSON.parse(event.body || "{}") as Employee;
      const employee = await this.employeeService.createEmployee(employeeData);
      return {
        statusCode: 201,
        body: JSON.stringify(employee),
      };
    } catch (error) {
      console.error("Error creating employee:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  }

  async getEmployee(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    try {
      const employeeId = event.pathParameters?.employeeId;
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
    } catch (error) {
      console.error("Error fetching employee:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  }

  async listEmployees(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    try {
      const employees = await this.employeeService.listEmployees();
      return {
        statusCode: 200,
        body: JSON.stringify(employees),
      };
    } catch (error) {
      console.error("Error fetching employees:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  }

  async createEmployeesFromExcel(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    try {
      const file = event?.body || null;
      if (!file) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "Missing Excel file in the request",
          }),
        };
      }

      const employees = await this.employeeService.createEmployeesFromExcel(
        file,
      );
      return {
        statusCode: 201,
        body: JSON.stringify(employees),
      };
    } catch (error) {
      console.error("Error creating employees from Excel:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  }
}

export { EmployeeController };

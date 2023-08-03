import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Employee from "../models/Employee";
import { readExcelFile } from "../utils/excelParser";

class EmployeeService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string,
  ) {}

  async createEmployee(employee: Employee): Promise<Employee> {
    const params = {
      TableName: this.tableName,
      Item: employee,
    };

    await this.docClient.put(params).promise();
    return employee;
  }

  async getEmployee(employeeId: string): Promise<Employee | null> {
    const params = {
      TableName: this.tableName,
      Key: { employeeId },
    };

    const result = await this.docClient.get(params).promise();
    return result.Item as Employee | null;
  }

  async listEmployees(): Promise<Employee[]> {
    const params = {
      TableName: this.tableName,
    };

    const result = await this.docClient.scan(params).promise();
    return result.Items as Employee[];
  }

  async createEmployeesFromExcel(file: any): Promise<Employee[]> {
    try {
      const employees: Employee[] = [];

      // Assuming readExcelFile is a function that parses the Excel file and returns the data as an array
      const data = readExcelFile(file);

      // Process the data and create employees
      for (const row of data) {
        const employee: Employee = {
          role: row.role,
          employeeId: row.employeeId, // Assuming employeeId is present in the Excel data
          name: row.name, // Assuming name is present in the Excel data
          email: row.email, // Assuming email is present in the Excel data
          department: row.department, // Assuming department is present in the Excel data
          createdAt: new Date().toISOString(),
        };

        await this.createEmployee(employee);
        employees.push(employee);
      }

      return employees;
    } catch (error) {
      console.error("Error creating employees from Excel:", error);
      throw new Error("Failed to create employees from Excel");
    }
  }
}

export default EmployeeService;

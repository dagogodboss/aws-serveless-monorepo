import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import AuthService from "../services/authService";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

class AuthController {
  private readonly authService: AuthService;

  constructor() {
    // Initialize authService with DynamoDB table name and DocumentClient instance
    const docClient = new DocumentClient();
    const tableName = process.env.DYNAMODB_TABLE_EMPLOYEES as string; // Replace with your employees table name
    this.authService = new AuthService(docClient, tableName);
  }

  async register(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    try {
      const { username, password } = JSON.parse(event.body || "{}");
      const newUser = await this.authService.register(username, password);
      return {
        statusCode: 201,
        body: JSON.stringify(newUser),
      };
    } catch (error) {
      console.error("Error registering user:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  }

  async login(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    try {
      const { username, password } = JSON.parse(event.body || "{}");
      const token = await this.authService.login(username, password);
      return {
        statusCode: 200,
        body: JSON.stringify({ token }),
      };
    } catch (error) {
      console.error("Error logging in:", error);
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Authentication failed" }),
      };
    }
  }
}

export { AuthController };

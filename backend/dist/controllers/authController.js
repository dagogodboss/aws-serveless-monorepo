"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = __importDefault(require("../services/authService"));
const dynamodb_1 = require("aws-sdk/clients/dynamodb");
class AuthController {
    constructor() {
        // Initialize authService with DynamoDB table name and DocumentClient instance
        const docClient = new dynamodb_1.DocumentClient();
        const tableName = process.env.DYNAMODB_TABLE_EMPLOYEES; // Replace with your employees table name
        this.authService = new authService_1.default(docClient, tableName);
    }
    async register(event, context) {
        try {
            const { username, password } = JSON.parse(event.body || "{}");
            const newUser = await this.authService.register(username, password);
            return {
                statusCode: 201,
                body: JSON.stringify(newUser),
            };
        }
        catch (error) {
            console.error("Error registering user:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal server error" }),
            };
        }
    }
    async login(event, context) {
        try {
            const { username, password } = JSON.parse(event.body || "{}");
            const token = await this.authService.login(username, password);
            return {
                statusCode: 200,
                body: JSON.stringify({ token }),
            };
        }
        catch (error) {
            console.error("Error logging in:", error);
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Authentication failed" }),
            };
        }
    }
}
exports.AuthController = AuthController;

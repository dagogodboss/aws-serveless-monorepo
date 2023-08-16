"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config"); // Replace with your JWT secret key
class AuthService {
    constructor(docClient, tableName) {
        this.docClient = docClient;
        this.tableName = tableName;
    }
    async register(username, password) {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const id = username; // Use username as user ID for simplicity
        // Save user to DynamoDB (assuming you have an employees table)
        const employeeItem = {
            id,
            username,
            password: hashedPassword,
        };
        const params = {
            TableName: this.tableName,
            Item: employeeItem,
        };
        await this.docClient.put(params).promise();
        return { id, username };
    }
    async login(username, password) {
        // Fetch user from DynamoDB by username
        const params = {
            TableName: this.tableName,
            Key: {
                id: username, // Use username as user ID
            },
        };
        const userResponse = await this.docClient.get(params).promise();
        const user = userResponse.Item;
        if (!user) {
            throw new Error("User not found");
        }
        // Validate password
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error("Invalid credentials");
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, config_1.JWT_SECRET, {
            expiresIn: "1h", // Token expires in 1 hour
        });
        return token;
    }
}
exports.default = AuthService;

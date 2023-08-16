import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { JWT_SECRET } from "../config"; // Replace with your JWT secret key

class AuthService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string,
  ) {}

  async register(
    username: string,
    password: string,
  ): Promise<{ id: string; username: string }> {
    const hashedPassword = await bcrypt.hash(password, 10);
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

  async login(username: string, password: string): Promise<string> {
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
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: "1h", // Token expires in 1 hour
      },
    );

    return token;
  }
}

export default AuthService;

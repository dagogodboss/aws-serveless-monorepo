/** @format */

import * as jwt from "jsonwebtoken";

// Function to verify the JWT token
export function verifyJwtToken(token: string): { role: string } | null {
  try {
    // Replace "YOUR_SECRET_KEY" with the actual secret key used for JWT token generation
    const decodedToken = jwt.verify(token, "YOUR_SECRET_KEY") as {
      role: string;
    };
    return decodedToken;
  } catch (error) {
    console.error("Error verifying JWT token:", error);
    return null;
  }
}

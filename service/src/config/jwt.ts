// service/src/config/jwt.ts
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Access the JWT secret from the environment variables
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in the .env file");
}

export default jwtSecret;

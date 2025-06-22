import type { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

interface DecodedToken extends JwtPayload {
  id: number;
  email: string;
  role: string;
}

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Error("Authorization header is missing");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new Error("Token is missing from the authorization header");
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    let decodedData;
    try {
      decodedData = jwt.verify(token, secret) as DecodedToken;
    } catch (error) {
      throw new Error("Invalid token");
    }

    req.user = decodedData;
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;

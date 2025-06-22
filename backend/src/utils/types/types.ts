import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ROLES } from "../enums/roles";

export interface DecodedToken extends JwtPayload {
  id: number;
  email: string;
  role: ROLES;
}

export interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

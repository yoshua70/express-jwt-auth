import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface JWTEncodeParams {
  userId: string;
  expiresIn: string;
  type: "access" | "refresh";
}

export interface JWTDecodeParams {
  token: string;
  secret: string;
}

export interface GetTokenParams {
  req: Request;
  cookieName: string;
}

export interface GetTokenReturn {
  accessToken: string | null;
  refreshToken: string | null;
}
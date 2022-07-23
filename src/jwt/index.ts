import { Request } from "express";
import { sign, verify } from "jsonwebtoken";

type JWTEncodeParams = {
  userId: string;
  expiresIn: string;
  type: "access" | "refresh";
};

type JWTDecodeParams = {
  token: string;
  secret: string;
};

type GetTokenParams = {
  req: Request;
  cookieName: string;
};

/**
 * Generate a JWT, either an access token or a refresh token.
 * The algorithm used by default is "HS256".
 */
export const encode = (params: JWTEncodeParams) => {
  const { userId, expiresIn, type } = params;

  const secret =
    type === "access"
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET;

  if (!secret) return null;

  return sign({ userId }, secret, {
    expiresIn,
  });
};

/**
 * Decode a JWT. Must provide a secret since the access
 * and refresh tokens may use different encoding secret.
 */
export const decode = (params: JWTDecodeParams) => {
  const { token, secret } = params;

  if (!token) return null;

  return verify(token, secret);
};

/**
 * Returns the token contained inside a request.
 * Looks for the token inside of the cookie or in the
 * `Authorization` headers.
 */
export const getToken = async (params: GetTokenParams) => {
  const { req, cookieName } = params;

  if (!req) throw new Error("Must pass `req` to JWT getToken()");

  const authorization = req.headers.authorization;

  let token = req.cookies[cookieName];

  if (!token && authorization?.split(" ")[0] === "Bearer") {
    token = authorization.split(" ")[1];
  }

  if (!token) return null;

  return token;
};

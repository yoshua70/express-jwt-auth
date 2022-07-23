import { sign, verify } from "jsonwebtoken";
import {
  JWTDecodeParams,
  JWTEncodeParams,
  GetTokenParams,
  GetTokenReturn,
} from "./types";

/**
 * Generate a JWT, either an access token or a refresh token.
 * The algorithm used by default is "HS256".
 */
export const encode = async (params: JWTEncodeParams) => {
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
export const decode = async (params: JWTDecodeParams) => {
  const { token, secret } = params;

  if (!token) return null;

  return verify(token, secret);
};

/**
 * Returns the token contained inside a request.
 * Looks for the token inside of the cookie or in the
 * `Authorization` headers.
 */
export const getToken = async (params: GetTokenParams): Promise<GetTokenReturn> => {
  const { req, cookieName } = params;

  if (!req) throw new Error("Must pass `req` to JWT getToken()");

  const authorization = req.headers.authorization;

  let accessToken = "";
  let refreshToken = "";

  if (authorization?.split(" ")[0] === "Bearer") {
    accessToken = authorization.split(" ")[1];
  }

  refreshToken = req.cookies[cookieName];

  return { accessToken: accessToken, refreshToken: refreshToken };
};

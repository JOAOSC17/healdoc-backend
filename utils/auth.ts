import * as jwt from "jsonwebtoken";
export const APP_SECRET = "teste";

export interface AuthTokenPayload {
    userId:number
}
export function decodeAuthHeader(authHeader:String) : AuthTokenPayload {
    const [, token] = authHeader.split(' ');
    if(!token) {
        throw new Error("No token found")
    }

    return jwt.verify(token, APP_SECRET) as AuthTokenPayload
}
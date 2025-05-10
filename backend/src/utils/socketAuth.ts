import { verifyToken } from "./verifyToken";
import { Socket } from "socket.io";
import cookie from "cookie";

export const socketAuth = (socket: Socket, next:Function) => {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) return next(new Error("No cookies"));
    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.token; 

    if (!token) return next(new Error("No token"));
    try {
        const decoded = verifyToken(token)
        socket.data.user = decoded;
        next()
    }
    catch (err) {
        return next(new Error("Invalid token"));
    }
}
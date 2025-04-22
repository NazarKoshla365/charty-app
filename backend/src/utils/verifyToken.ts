import jwt from "jsonwebtoken"

export const verifyToken = (token: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    }
    catch (err) {
        console.error(err);
        throw new Error("Invalid token");
    }
}   
import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import cookie from "cookie";
const onlineUsers = new Map<string, string>()
import Message from "./models/message"


export const InitSocket = (server: HTTPServer) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ['POST', 'GET'],
            credentials: true
        }
    })

    io.use((socket: Socket, next) => {
        const cookies = socket.handshake.headers.cookie;
        if (!cookies) return next(new Error("No cookies"));
        const parsedCookies = cookie.parse(cookies);
        const token = parsedCookies.token; // назва cookie (наприклад: 'token')

        if (!token) return next(new Error("No token"));
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
            socket.data.user = decoded;
            next()
        }
        catch (err) {
            return next(new Error("Invalid token"));
        }

    })
    io.on("connection", (socket: Socket) => {
        const userId = socket.data.user.id;
        console.log("🔌 New user connected", userId);
        onlineUsers.set(userId, socket.id)

        socket.broadcast.emit("user-online", userId);



        socket.on("join-chat", (chatId) => {
            socket.join(chatId);
            console.log(`User ${userId} joined chat ${chatId}`);
        });


        socket.on("send-message", async({ chatId, message }) => {
            try{
                const newMessage = new Message({
                    chat:chatId,
                    from:userId,
                    message:message
                })
                const savedMessage =  await newMessage.save()
              
                io.to(chatId).emit("receive-message",savedMessage);
            }
            catch(err){
                console.error("Error to save message",err)
            }
            
        });
        
        socket.on("check-online-status", (targetUserId: string, cb) => {
            cb(onlineUsers.has(targetUserId));
        });


        socket.on("disconnect", () => {
            console.log("❌ User disconnected", userId);
            onlineUsers.delete(userId)
            socket.broadcast.emit("user-offline", userId);
        });
    })
    return io
}


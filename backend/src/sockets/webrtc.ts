import { Server, Socket } from "socket.io";
import { socketAuth } from "../utils/socketAuth";

const connectedUsers = new Map<string, string>();

export const InitWebRTC = (io: Server) => {
    io.use(socketAuth);

    io.on("connection", (socket: Socket) => {
        const userId = socket.data.user.id;
        console.log(`🟢 ${userId} connected`);

        connectedUsers.set(userId, socket.id);

        socket.on("call-user", ({ to, from, roomId }) => {
            const targetSocketId = connectedUsers.get(to);
            if (targetSocketId) {
                console.log(`📞 ${from} is calling ${to}`);
                io.to(targetSocketId).emit("incoming-call", { to });
            }
        })

        socket.on("accept-call", ({ to, roomId }) => {
            const targetSocketId = connectedUsers.get(to);
            if (targetSocketId) {
                console.log(`✅ ${userId} accepted call from ${to}`);
                io.to(targetSocketId).emit("call-accepted", { roomId });
            }
        })


        socket.on("reject-call", ({ to }) => {
            const targetSocketId = connectedUsers.get(to);
            if (targetSocketId) {
                console.log(`❌ ${userId} rejected call from ${to}`);
                io.to(targetSocketId).emit("call-rejected");
            }
        });

        socket.on("join room", (roomId: string) => {
            socket.join(roomId);

            const clients = io.sockets.adapter.rooms.get(roomId);
            const clientCount = clients?.size || 0;

            console.log(`👤 ${userId} joined room ${roomId} (${clientCount} clients)`);

            if (clientCount === 2) {
                socket.to(roomId).emit("user-joined");
            }
        });

        socket.on("offer", (offer, roomId) => {
            socket.to(roomId).emit("offer", offer);
        });

        socket.on("answer", (answer, roomId) => {
            socket.to(roomId).emit("answer", answer);
        });

        socket.on("ice-candidate", (candidate, roomId) => {
            socket.to(roomId).emit("ice-candidate", candidate);
        });
        socket.on("call-end", (roomId) => {
            socket.to(roomId).emit("call-end");
        })

        socket.on("disconnect", () => {
            console.log(`🔴 ${userId} disconnected`);
            connectedUsers.delete(userId);
        });
    });
};

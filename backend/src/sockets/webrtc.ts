import { Server, Socket } from "socket.io";
import { socketAuth } from "../utils/socketAuth";

export const InitWebRTC = (io: Server) => {
    io.use(socketAuth);

    io.on("connection", (socket: Socket) => {
        const userId = socket.data.user.id;
        console.log(`🟢 ${userId} connected`);

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
        });
    });
};

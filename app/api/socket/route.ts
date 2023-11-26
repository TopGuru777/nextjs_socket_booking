import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import type {
  NextApiResponseWithSocket,
  ServerToClientEvents,
  ClientToServerEvents,
} from "@/app/types/socket";

export default function ioHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  let activeConnections = 0;
  //  Server intialization

  if (!res.socket.server.io) {
    console.log("*First use, starting socket.io");

    const io = new Server<ClientToServerEvents, ServerToClientEvents>(
      res.socket.server
    );

    io.on("connection", (socket) => {
      // Server side Logic
      activeConnections++;
      socket.broadcast.emit("userServerConnection");
      socket.on("updateStatus", (message) => {
        socket.broadcast.emit("updateStatus", message);
      });
      socket.on("disconnect", () => {
        activeConnections--;
        console.log("A user disconnected");
        socket.broadcast.emit("userServerDisconnection", socket.id);
      });
    });
    res.socket.server.io = io;
  } else {
    console.log("socket.io already running");
  }
  res.end();
}

export const dynamic = "auto";
export const runtime = "nodejs";

import { Server } from "socket.io";
import { env } from "./env.js";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: { origin: env.clientUrl, credentials: true },
  });

  io.on("connection", (socket) => {
    socket.emit("notification", {
      title: "Connected",
      message: "Live notifications are active.",
    });
  });

  return io;
}

export function emitNotification(payload) {
  io?.emit("notification", payload);
}

export function emitOrderUpdate(payload) {
  io?.emit("order:update", payload);
}

export function emitDashboardUpdate(payload) {
  io?.emit("dashboard:update", payload);
}

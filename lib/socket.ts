// src/lib/socket.ts
import { io } from "socket.io-client";
import { BACKEND_PORT } from "@/constants";

export const socket = io(BACKEND_PORT, {
  transports: ["websocket"],
  withCredentials: true,
});

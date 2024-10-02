import { Server as SocketIO } from "socket.io";
import registerHandler from "../handlers/register.handler.js";

const initSocket = (server) => {
  const io = new SocketIO({ pingTimeout: 10000 });
  io.attach(server);

  registerHandler(io);
};

export default initSocket;

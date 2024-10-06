import { addUser } from "../models/user.model.js";
import { v4 as uuidV4 } from "uuid";
import { handleConnection, handleDisconnect, handlerEvent } from "./helper.js";

const registerHandler = (io) => {
  io.on("connection", (socket) => {
    const { uuid } = socket.handshake.query;
    const userUUID = uuid !== "null" ? uuid : uuidV4();

    addUser({ uuid: userUUID, socketId: socket.id });

    handleConnection(socket, userUUID);

    socket.on("event", (data) => handlerEvent(io, socket, data));

    // 접속 해제시 이벤트
    socket.on("disconnect", () => {
      handleDisconnect(socket, userUUID);
    });
  });
};

export default registerHandler;

import { addUser } from "../models/user.model.js";
import { v4 as uuidV4 } from "uuid";
import { handleConnection, handleDisconnect, handlerEvent } from "./helper.js";

const registerHandler = (io) => {
  io.on("connection", (socket) => {
    const { uuid } = socket.handshake.query;
    // 로컬스토리지에 저장된 uuid가 없으면 uuid v4를 이용하여 생성
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

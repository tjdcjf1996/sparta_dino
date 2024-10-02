import { CLIENT_VERSION } from "../constant.js";
import { getUser, removeUser } from "../models/user.model.js";
import handlerMappings from "./handlerMapping.js";
import { createStage } from "../models/stage.model.js";

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id);
  console.log(`user disconnected : ${socket.id}`);
  console.log(`current user :`, getUser());
};

export const handleConnection = (socket, uuid) => {
  console.log(`New user Connected! : ${uuid} with socket ID ${socket.id}`);
  console.log(`current users: `, getUser());
  createStage(uuid);
  socket.emit("connection", { uuid });
};

export const handlerEvent = (io, socket, data) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit("response", {
      status: "fail",
      message: "Client Version mismatch",
    });
    return;
  }

  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit("response", { status: "fail", message: "Handler not found" });
  }

  const response = handler(data.userId, data.payload);

  if (response.broadcast) {
    io.emit("response", "broadcast");
    return;
  }
  socket.emit("response", response);
};

import { CLIENT_VERSION } from "../constant.js";
import { getUser, removeUser } from "../models/user.model.js";
import handlerMappings from "./handlerMapping.js";
import { createStage } from "../models/stage.model.js";
import { createItems } from "../models/item.model.js";

// 연결해제 핸들러
export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id);
  console.log(`user disconnected : ${socket.id}`);
  console.log(`current user :`, getUser());
};
// 연결 핸들러
export const handleConnection = (socket, uuid) => {
  console.log(`New user Connected! : ${uuid} with socket ID ${socket.id}`);
  console.log(`current users: `, getUser());
  createStage(uuid);
  createItems(uuid);
  socket.emit("connection", { uuid });
};
// 이벤트 핸들러
export const handlerEvent = async (io, socket, data) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit("response", {
      status: "fail",
      message: "Client Version mismatch",
    });
    return;
  }
  // 핸들러 매핑 과정
  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit("response", { status: "fail", message: "Handler not found" });
  }

  // 매핑된 핸들러 호출 후 결과값 저장
  const response = await handler(data.userId, data.payload);
  // 매핑된 핸들러가 Promise로 반환주는 경우 해체해서 응답
  if (response instanceof Promise) {
    response.then((responseValue) => {
      if (responseValue.broadcast) {
        io.emit(response.types, { score: response.score });
        return;
      }
      socket.emit(`${data.handlerId}_response`, responseValue);
    });
  }
  // broadcast가 true일 경우
  if (response.broadcast) {
    io.emit(response.types, { score: response.score });
    socket.emit(`response`, {
      status: response.status,
      message: response.message,
      score: response.score,
    });
    return;
  }
  socket.emit(`${data.handlerId}_response`, response);
  socket.emit(`response`, response);
};

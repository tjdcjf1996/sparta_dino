import { CLIENT_VERSION } from "./Constants.js";

const socket = io("http://localhost:3000", {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
socket.on("response", (data) => {
  console.log(data);
});

socket.on("connection", (data) => {
  console.log("connection: ", data);
  userId = data.uuid;
});

socket.on("disconnect", () => {
  console.log("서버와의 연결이 끊어졌습니다.");
});

const sendEvent = (handlerId, payload) => {
  socket.emit("event", {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent };

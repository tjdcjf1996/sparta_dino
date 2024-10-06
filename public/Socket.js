import { CLIENT_VERSION } from "./Constants.js";

let uuid = localStorage.getItem("uuid");
const socket = io("http://localhost:3000", {
  query: {
    clientVersion: CLIENT_VERSION,
    uuid,
  },
});

let userId = null;
socket.on("response", (data) => {
  console.log(data);
});

socket.on("connection", (data) => {
  console.log("connection: ", data, uuid);

  if (uuid === "null") {
    localStorage.setItem("uuid", data.uuid);
    console.log("UUID saved to localStorage:", data.uuid);
  }
  userId = data.uuid;
});

socket.on("disconnect", () => {
  console.log("서버와의 연결이 끊어졌습니다.");
});

const sendEvent = (handlerId, payload) => {
  return new Promise((resolve) => {
    socket.emit("event", {
      userId,
      clientVersion: CLIENT_VERSION,
      handlerId,
      payload,
    });
    // 해당 handlerId에 대한 응답을 기다림
    socket.once(`${handlerId}_response`, (data) => {
      // 성공 시 데이터를 반환
      resolve(data);
    });
  });
};

// const sendEvent = (handlerId, payload) => {
//   socket.emit("event", {
//     userId,
//     clientVersion: CLIENT_VERSION,
//     handlerId,
//     payload,
//   });

//   socket.once(`${handlerId}_response`, (data) => {
//     return data;
//   });
// };

export { sendEvent };

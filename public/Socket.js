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

socket.on("rank", (data) => {
  const rank = document.getElementById("rank");
  rank.innerHTML = `
    <h2>유저 1등 점수 ${data.score}점으로 갱신! </h2>
    `;
  setTimeout(() => {
    rank.innerHTML = ``;
  }, 5000);
});

socket.on("connection", (data) => {
  console.log("connection: ", data, uuid);
  // 소켓 쿼리에 로컬스토리지에 있는 uuid를 담아서 보냄
  // 없는 경우 서버측에서 data에 uuid를 생성해서 보냄
  // 클라이언트측에서 로컬스토리지 저장 과정 거침
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

// 동기처리 sendEvent 백업
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

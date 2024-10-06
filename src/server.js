import express, { json } from "express";
import { createServer } from "http";
import initSocket from "./init/socket.js";
import { loadGameAssets } from "./init/assets.js";
import { getGameAssets } from "../src/init/assets.js";

const app = express();
const server = createServer(app);
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
initSocket(server); // 소켓 추가

app.get("/api/getAssets", (req, res) => {
  const data = getGameAssets();
  if (!data) return res.status(404).json({ message: "Not found assets" });
  return res.json(data);
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  const assets = await loadGameAssets();
  console.log(assets);
  console.log("success");
});

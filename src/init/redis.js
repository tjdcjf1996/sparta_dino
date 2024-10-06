import { Redis } from "ioredis";

export const redisClient = new Redis(6379, "192.168.0.3");

// Redis 연결 및 에러 처리
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

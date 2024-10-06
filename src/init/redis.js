import { createClient } from "redis";

export const redisClient = createClient({
  url: "redis://192.168.0.3:6379", // Redis 서버 URL
});

// Redis 연결 및 에러 처리
export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Redis connection error:", err);
  }
};

redisClient.on("error", (err) => {
  console.log("Redis Error : ", err);
});

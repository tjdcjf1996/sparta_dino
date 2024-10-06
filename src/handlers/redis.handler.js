import { redisClient } from "../init/redis.js";

// 사용자의 점수를 가져오는 함수
export const getUserScore = async (uuid) => {
  const hashKey = `uuid:${uuid}:score`;
  try {
    let userScore = await redisClient.hGetAll(hashKey);
    if (!userScore.bestScore) {
      return 0;
    }
    return Number(userScore.bestScore);
  } catch (err) {
    return { status: "fail", message: "Error reading user score" };
  }
};

// 사용자의 점수를 설정하는 함수
export const setUserScore = async (uuid, score) => {
  const hashKey = `uuid:${uuid}:score`;

  try {
    // 이전 점수를 가져옵니다.
    const userScore = await getUserScore(uuid);

    if (userScore.status === "fail") throw new Error(userScore.message);

    // 기본값 설정
    const bestScore = userScore
      ? Math.max(Math.floor(userScore), score)
      : score;

    // Redis에 점수를 설정합니다.

    await redisClient.hSet(hashKey, "bestScore", bestScore);

    return { status: "success", message: "Score set successfully" };
  } catch (err) {
    console.error("Error retrieving user score:", err);
    return { status: "fail", message: "Error retrieving user score" };
  }
};

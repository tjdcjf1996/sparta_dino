import { redisClient } from "../init/redis.js";

// 사용자의 점수를 가져오는 함수
export const getUserScore = async (uuid, payload) => {
  const hashKey = `uuid:${uuid}:score`;

  try {
    let userScore = await redisClient.hgetall(hashKey);
    if (!userScore.bestScore) {
      return 0;
    }
    return Number(userScore.bestScore);
  } catch (err) {
    return { status: "fail", message: "Error reading user score" };
  }
};

export const getHighScore = async () => {
  try {
    // zrevrange를 await로 사용하여 결과를 가져옵니다
    const result = await redisClient.zrevrange("rank", 0, 0, "WITHSCORES");

    if (!result || result.length === 0) {
      return { status: "fail", message: "No scores found" };
    }

    return {
      status: "success",
      uuid: result[0], // 최고 점수를 가진 UUID
      score: result[1], // 해당 점수
    };
  } catch (err) {
    console.error("Error getting high score:", err); // 에러 로그
    return { status: "fail", message: "Server error" };
  }
};

// 사용자의 점수를 설정하는 함수
export const setUserScore = async (uuid, score) => {
  const hashKey = `uuid:${uuid}:score`;

  try {
    // 이전 점수 가져오기
    const userScore = await getUserScore(uuid);

    if (userScore.status === "fail") throw new Error(userScore.message);

    // 기본값 설정
    const bestScore = userScore
      ? Math.max(Math.floor(userScore), score)
      : score;

    // Redis에 점수를 설정

    await redisClient.hset(hashKey, "bestScore", bestScore);
    // 랭크를 위해 zAdd로 set도 추가
    await redisClient.zadd("rank", bestScore, uuid);

    const HighScore = await getHighScore();
    console.log(HighScore);
    if (HighScore.status === "success") {
      if (Number(HighScore.score) === score) {
        console.log("최고기록 갱신");
        return { broadcast: true, types: "rank", score: bestScore };
      }
    }

    return { status: "success", message: "Score set successfully" };
  } catch (err) {
    console.error("Error retrieving user score:", err);
    return { status: "fail", message: "Error retrieving user score" };
  }
};

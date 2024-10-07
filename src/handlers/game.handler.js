import { getGameAssets } from "../init/assets.js";
import { clearItems, getItems } from "../models/item.model.js";
import { clearStage, getStage, setStage } from "../models/stage.model.js";
import { setUserScore } from "../handlers/redis.handler.js";

export const gameStart = (uuid, payload) => {
  const { stage } = getGameAssets();
  clearStage(uuid);
  clearItems(uuid);
  // 스테이지 0으로 설정
  setStage(uuid, stage.data[0].id, payload.timestamp, 0);

  return { status: "success" };
};

export const gameEnd = async (uuid, payload) => {
  const { timestamp: gameEndTime, score } = payload;
  let currentStage = getStage(uuid);
  const { item } = getGameAssets();
  if (!currentStage.length) {
    return { status: "fail", message: "No stages found for user" };
  }

  // 스테이지 오름차순 정렬
  currentStage.sort((a, b) => a.id - b.id);
  const currentStageId = currentStage[currentStage.length - 1].id;

  const currentScore = currentStage[currentStage.length - 1].score; // 최근 스코어
  const elapsedTime =
    (gameEndTime - currentStage[currentStage.length - 1].timestamp) / 1000; // 게임종료시간 - 최근 저장된 스테이지 시간

  // 현재 스테이지에서 먹은 아이템 점수 계산
  const eatItems = getItems(uuid).filter(
    (item) => item.stage === currentStageId
  );
  const eatItemScore = eatItems.length
    ? eatItems.reduce((acc, cur) => {
        const itemInfo = item.data.find((i) => i.id === cur.id);
        const itemScore = itemInfo ? itemInfo.score : 0;
        return acc + itemScore;
      }, 0)
    : 0;

  // 예상 점수
  // 마지막 저장된 스테이지 -> s
  // (게임종료시간 - s의 시간) * 스테이지 perSecond + s 점수 + 해당 스테이지 먹은 아이템 점수
  const expectedScore =
    currentScore + elapsedTime * score.perSecond + eatItemScore;

  if (Math.abs(score.score - expectedScore) > 5) {
    return { status: "fail", message: "score verification failed" };
  }

  const result = await setUserScore(uuid, Math.floor(score.score));
  if (result.status === "fail") {
    console.log(result.message);
    return result;
  }
  console.log("Game ended successfully"); // 게임 종료 확인 로그

  if (result.broadcast) {
    return result;
  }

  return { status: "success", message: "Game Ended", score };
};

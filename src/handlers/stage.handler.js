import { getGameAssets } from "../init/assets.js";
import { getItems } from "../models/item.model.js";
import { getStage, setStage } from "../models/stage.model.js";

export const moveStageHandler = (userId, payload) => {
  let currentStage = getStage(userId);
  const { stage, item } = getGameAssets();

  if (!currentStage.length) {
    return { status: "fail", message: "No stages found for user" };
  }

  currentStage.sort((a, b) => a.id - b.id);
  const currentStageId = currentStage[currentStage.length - 1].id;

  // 스테이지 ID 검증
  if (currentStageId !== payload.currentStage) {
    return {
      status: "fail",
      message: `Expected stage ${currentStageId}, but got ${payload.currentStage}`,
    };
  }

  const serverTime = Date.now();
  const elapsedTime =
    (serverTime - currentStage[currentStage.length - 1].timestamp) / 1000;

  const curStage = stage.data.find((stage) => stage.id === currentStageId);
  const targetStage = stage.data.find(
    (stage) => stage.id === payload.targetStage
  );

  if (!targetStage) {
    return { status: "fail", message: "Target stage not found" };
  }

  // 현재 스테이지에서 먹은 아이템 점수 계산
  const eatItems = getItems(userId).filter(
    (item) => item.stage === currentStageId
  );

  const eatItemScore = eatItems.reduce((acc, cur) => {
    const itemInfo = item.data.find((i) => i.id === cur.id);
    const itemScore = itemInfo ? itemInfo.score : 0;
    return acc + itemScore;
  }, 0);

  // 예상 점수 계산
  const expectedScore =
    Math.floor(elapsedTime * curStage.perSecond) + eatItemScore;
  console.log(expectedScore);
  // 검증
  if (payload.score - 1 > expectedScore || payload.score + 1 < expectedScore) {
    return { status: "fail", message: "Score verification failed" };
  }

  // 스테이지 업데이트
  setStage(userId, payload.targetStage, serverTime);

  return { status: "success", message: "Move to target stage" };
};

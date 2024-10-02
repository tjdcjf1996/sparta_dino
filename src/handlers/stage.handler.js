import { getGameAssets } from "../init/assets.js";
import { getStage, setStage } from "../models/stage.model.js";

export const moveStageHandler = (userId, payload) => {
  let currentStage = getStage(userId);

  if (!currentStage.length) {
    return { status: "fail", message: "No stages found for user" };
  }

  currentStage.sort((a, b) => a.id - b.id);
  const currentStageId = currentStage[currentStage.length - 1].id;
  if (currentStageId !== payload.currentStage)
    return { status: "fail", message: "current stage mismatch" };

  // 점수 검증
  const serverTime = Date.now();
  const elapsedTime =
    (serverTime - currentStage[currentStage.length - 1].timestamp) / 1000;
  console.log(currentStage.timestamp);
  console.log(elapsedTime);
  // 1스테이지 -> 2스테이지로 넘어가는 가정
  if (elapsedTime < 100 || elapsedTime > 105) {
    return { status: "fail", message: "Invalid elapsed time" };
  }

  const { stage } = getGameAssets();
  if (!stage.data.some((stage) => stage.id === payload.targetStage))
    return { status: "fail", message: "Target stage not found" };

  setStage(userId, payload.targetStage, serverTime);

  return { status: "success" };
};

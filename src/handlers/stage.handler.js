import { getGameAssets } from "../init/assets.js";
import { getStage, setStage } from "../models/stage.model.js";

export const moveStageHandler = (userId, payload) => {
  let currentStage = getStage(userId);
  const { stage } = getGameAssets();

  // 유저가 진행한 스테이지가 없을 경우
  if (!currentStage.length) {
    return { status: "fail", message: "No stages found for user" };
  }

  // 최근 진행한 스테이지를 오름차순으로 정렬
  currentStage.sort((a, b) => a.id - b.id);
  // 가장 맨 뒤의 요소를 가져옴으로써 최근 스테이지를 찾음
  const currentStageId = currentStage[currentStage.length - 1].id;
  if (currentStageId !== payload.currentStage)
    return { status: "fail", message: "current stage mismatch" };

  // 점수 검증
  const serverTime = Date.now();
  const elapsedTime =
    (serverTime - currentStage[currentStage.length - 1].timestamp) / 1000;

  // 기존 스테이지 점수를 구함
  const curStage = stage.data.find((stage) => stage.id === currentStageId);

  // 다음 타켓 스테이지의 점수를 구함.
  const targetStage = stage.data.find(
    (stage) => stage.id === payload.targetStage
  );
  if (!targetStage)
    return { status: "fail", message: "Target stage not found" };
  // 타겟 스테이지 점수와 기존 스테이지 점수의 차이를 구함.
  const intervalScore = targetStage.score - curStage.score;

  // 타겟 스테이지 점수 네트워크 시간 오차범위
  if (elapsedTime < intervalScore - 0.5 || elapsedTime > intervalScore + 0.5) {
    return { status: "fail", message: "Invalid elapsed time" };
  }

  setStage(userId, payload.targetStage, serverTime);

  return { status: "success", message: "Move to target stage" };
};

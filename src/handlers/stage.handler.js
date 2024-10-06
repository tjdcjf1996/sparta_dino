import { getGameAssets } from "../init/assets.js";
import { getItems } from "../models/item.model.js";
import { getStage, setStage } from "../models/stage.model.js";

export const moveStageHandler = (userId, payload) => {
  // 최근 스테이지 로드
  const currentTime = payload.time;
  let currentStage = getStage(userId);
  const { stage, item } = getGameAssets();

  if (!currentStage.length) {
    return { status: "fail", message: "No stages found for user" };
  }

  // 스테이지 오름차순 정렬
  currentStage.sort((a, b) => a.id - b.id);
  const currentStageId = currentStage[currentStage.length - 1].id;

  // 현재 스테이지 ID 검증
  if (currentStageId !== payload.currentStage) {
    return {
      status: "fail",
      message: `Expected stage ${currentStageId}, but got ${payload.currentStage}`,
    };
  }

  // 타겟 스테이지 검증
  const targetStage = stage.data.find(
    (stage) => stage.id === payload.targetStage
  );

  if (!targetStage) {
    return { status: "fail", message: "Target stage not found" };
  }

  // 현재 시간
  const currentScore = currentStage[currentStage.length - 1].score; // 최근 스코어
  const elapsedScore = payload.score - currentScore; // 현재 스코어 - 최근 스코어
  const curStage = stage.data.find((stage) => stage.id === currentStageId);
  const currentStagePerSecond = curStage.perSecond; // 기존 초당 점수
  const elapsedTime =
    (currentTime - currentStage[currentStage.length - 1].timestamp) / 1000; // 현재 서버시간 - 전 서버시간

  // 현재 스테이지에서 먹은 아이템 점수 계산
  const eatItems = getItems(userId).filter(
    (item) => item.stage === currentStageId
  );
  const eatItemScore = eatItems.length
    ? eatItems.reduce((acc, cur) => {
        const itemInfo = item.data.find((i) => i.id === cur.id);
        const itemScore = itemInfo ? itemInfo.score : 0;
        return acc + itemScore;
      }, 0)
    : 0;

  // 예상 점수 계산
  // const expectedScore = elapsedTime * currentStagePerSecond + eatItemScore;
  const expectedScore =
    elapsedTime * currentStagePerSecond + currentScore + eatItemScore;
  console.log("예상 점수 : ", expectedScore);
  console.log("현재 점수 : ", payload.score);
  console.log(`elapsedTime : ${elapsedTime}`);
  console.log(`currentStagePerSecond : ${currentStagePerSecond}`);
  console.log(`eatItem:${eatItemScore}`);
  console.log(expectedScore);

  // 전 스코어 + 시간차 * per + 아이템
  // 점수 검증 - (현재 점수 - 최근 setStage 점수)  &  (현재 서버시간 - 전 서버시간) * perSecond + item 점수  두가지 비교
  if (
    payload.score <= expectedScore - 5 ||
    payload.score >= expectedScore + 5
  ) {
    console.log("[실패]예상 점수 : ", expectedScore);
    console.log("[실패]현재 점수 : ", payload.score);
    return { status: "fail", message: "Score verification failed" };
  }

  // 스테이지 업데이트
  setStage(userId, payload.targetStage, currentTime, payload.score);
  console.log(`스테이지 등록된 점수 ${payload.score}`);
  console.log(`전 스테이지와 점수차이 : `, elapsedScore);
  return { status: "success", message: "Move to target stage" };
};

import { getGameAssets } from "../init/assets.js";
import { clearItems, setItems } from "../models/item.model.js";
import { clearStage, getStage, setStage } from "../models/stage.model.js";

let gameClock;

export const gameTime = () => {
  return gameClock;
};

export const gameStart = (uuid, payload) => {
  const { stage } = getGameAssets();
  clearStage(uuid);
  clearItems(uuid);
  setStage(uuid, stage.data[0].id, payload.timestamp, 0);
  console.log("stage: ", getStage(uuid));

  return { status: "success" };
};

export const gameEnd = (uuid, payload) => {
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);
  if (!stages.length) {
    return { status: "fail", message: "No stages found for user" };
  }

  let totalScore = 0;

  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) stageEndTime = gameEndTime;
    else stageEndTime = stages[index + 1].timestamp;

    const stageDuration = (stageEndTime - stage.timestamp) / 1000;
    totalScore += stageDuration;
  });

  if (Math.abs(score - totalScore) > 5) {
    return { status: "fail", message: "score verification failed" };
  }

  return { status: "success", message: "Game Ended", score };
};

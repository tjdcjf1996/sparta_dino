import { sendEvent } from "./Socket.js";

let stageScore;
async function fetchData() {
  try {
    const res = await fetch("/api/getAssets");
    const data = await res.json();
    stageScore = data.stage.data;
  } catch (error) {
    console.error("Error fetch:", error);
  }
}

fetchData();

class Stage {
  stage = 0;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  getStage() {
    return this.stage;
  }

  getStageId() {
    return stageScore[this.stage].id;
  }

  async nextStage(score) {
    const result = await sendEvent(11, {
      currentStage: stageScore[this.stage].id,
      targetStage: stageScore[this.stage + 1].id,
      score,
      time: performance.now(),
    });
    if (result.status === "success") {
      this.stage++;
      return result;
    }
  }

  reset() {
    this.stage = 0;
  }

  draw() {
    const y = 20 * this.scaleRatio;
    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = "#525250";
    const stageX = 20 * this.scaleRatio;
    const stagePadded = "Stage : " + Math.floor(this.stage + 1).toString();

    this.ctx.fillText(stagePadded, stageX, y);
  }
}

export default Stage;

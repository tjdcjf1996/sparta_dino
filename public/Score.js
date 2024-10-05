import { sendEvent } from "./Socket.js";

let stageScore;
let itemAsset;
async function fetchData() {
  try {
    const res = await fetch("/api/getAssets");
    const data = await res.json();
    stageScore = data.stage.data;
    itemAsset = data.item.data;
  } catch (error) {
    console.error("Error fetch:", error);
  }
}

await fetchData();

class Score {
  score = 0;
  perSecond = 1;
  HIGH_SCORE_KEY = "highScore";
  stageChange = true;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  async update(deltaTime, stage) {
    this.score += deltaTime * this.perSecond * 0.001;
    // 등록된 스테이지 데이터 테이블 점수 내에서만 구동
    if (Math.floor(this.score) <= stageScore[stageScore.length - 1].score) {
      // 다음 스테이지 조건 점수와 현재 점수가 같으면서 stageChance가 true일 때 스테이지 변경 시도
      if (
        Math.floor(this.score) >= stageScore[stage.getStage() + 1].score &&
        this.stageChange
      ) {
        // 프레임단위 호출이기 때문에 여러번 호출되는 것을 방지
        this.stageChange = false;
        const result = await stage.nextStage(this.score);
        // 스테이지 증가와 동시에 초당 점수 변경
        if (result.status === "success") {
          this.perSecond = stageScore[stage.getStage()].perSecond;
          console.log(
            `${stage.getStage()} 스테이지로 변동되었습니다. 지금부터 초당 ${this.perSecond}점씩 오릅니다.`
          );
          setTimeout(() => {
            this.stageChange = true;
          }, 1000);
        }
      }
    }
  }

  async getItem(itemId, stage) {
    console.log(itemAsset);
    const eatenItem = itemAsset.find((asset) => asset.id === itemId);
    if (!eatenItem) console.log("Item asset error");
    else {
      const result = await sendEvent(20, {
        itemId,
        stageId: stage.getStageId(),
      });
      if (result.status === "success") {
        this.score += eatenItem.score;
      } else {
        console.log(result.message);
      }
    }
  }

  reset() {
    this.score = 0;
    this.perSecond = 1;
    this.stageChange = true;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = "#525250";

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;

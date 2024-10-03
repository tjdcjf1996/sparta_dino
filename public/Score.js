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

class Score {
  stage = 0;
  score = 0;
  HIGH_SCORE_KEY = "highScore";
  stageChange = true;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001;
    // 등록된 스테이지 데이터 테이블 점수 내에서만 구동
    if (Math.floor(this.score) <= stageScore[stageScore.length - 1].score) {
      // 다음 스테이지 조건 점수와 현재 점수가 같으면서 stageChance가 true일 때 스테이지 변경 시도
      if (
        Math.floor(this.score) === stageScore[this.stage + 1].score &&
        this.stageChange
      ) {
        // 프레임단위 호출이기 때문에 여러번 호출되는 것을 방지
        this.stageChange = false;
        // 현재 스테이지 아이디와 타겟 스테이지 아이디를 서버로 전송함
        sendEvent(11, {
          currentStage: stageScore[this.stage].id,
          targetStage: stageScore[this.stage + 1].id,
        });
        // 해당 점수가 지나갈 때 stageChange가 true로 바뀌게 1초 setTimeOut 설정
        setTimeout(() => {
          this.stage++;
          this.stageChange = true;
        }, 1000);
      }
    }
  }

  getItem(itemId) {
    this.score += 0;
  }

  reset() {
    this.score = 0;
    this.stage = 0;
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

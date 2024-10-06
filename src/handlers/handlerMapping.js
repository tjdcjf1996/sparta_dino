import { gameEnd, gameStart } from "./game.handler.js";
import { moveStageHandler } from "./stage.handler.js";
import { eatItem } from "./item.handler.js";
import { getHighScore, getUserScore } from "./redis.handler.js";

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
  20: eatItem,
  30: getUserScore,
  31: getHighScore,
};

export default handlerMappings;

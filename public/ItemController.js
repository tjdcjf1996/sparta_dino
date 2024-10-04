import Item from "./Item.js";

let itemAsset, itemUnlockAsset;
async function fetchData() {
  try {
    const res = await fetch("/api/getAssets");
    const data = await res.json();
    itemAsset = data.item.data;
    itemUnlockAsset = data.item_unlock.data;
  } catch (error) {
    console.error("Error fetch:", error);
  }
}

fetchData();

class ItemController {
  INTERVAL_MIN = 0;
  INTERVAL_MAX = 12000;

  nextInterval = null;
  items = [];

  constructor(ctx, itemImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextItemTime();
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(
      this.INTERVAL_MIN,
      this.INTERVAL_MAX
    );
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createItem(stage) {
    console.log(`stage : ${stage}`);
    console.log(itemUnlockAsset);
    const getStage = itemUnlockAsset.find((asset) => asset.stage_id === stage);

    // 정해놓은 스테이지 아이템이 있을때만 아이템 생성
    if (getStage) {
      console.log(`getStage : ${getStage}`);
      const index = getStage.item_id;
      console.log(`index : ${index}`);
      const itemInfo = this.itemImages.find((item) => item.id === index);
      const x = this.canvas.width * 1.5;
      const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

      const item = new Item(
        this.ctx,
        itemInfo.id,
        x,
        y,
        itemInfo.width,
        itemInfo.height,
        itemInfo.image
      );

      this.items.push(item);
    }
  }

  update(gameSpeed, deltaTime, stage) {
    if (this.nextInterval <= 0) {
      this.createItem(stage);
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(
        collidedItem.x,
        collidedItem.y,
        collidedItem.width,
        collidedItem.height
      );
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
  }
}

export default ItemController;

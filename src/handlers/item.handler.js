import { setItems, getItems } from "../models/item.model.js";
import { getGameAssets } from "../init/assets.js";

export const eatItem = (uuid, payload) => {
  const { item_unlock } = getGameAssets();

  // 먹은 아이템이 현재 스테이지에서 등장할 수 있는 것인지 체크
  const stageItemList = item_unlock.data.find(
    (asset) => asset.stage_id === payload.stageId
  );

  if (!stageItemList)
    return { status: "fail", message: "Not found item in stage" };
  // 먹은 item과 데이터테이블 비교
  const availableItem = stageItemList.item_id === payload.itemId;
  if (availableItem) {
    setItems(uuid, payload.itemId, payload.stageId);
    return { status: "success", message: "oishi" };
  }
  return { status: "fail", message: "rotten item" };
};

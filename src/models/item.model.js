const items = {};

export const createItems = (uuid) => {
  items[uuid] = [];
  console.log("items LIST");
  console.log(items);
};

export const getItems = (uuid) => {
  return items[uuid];
};

export const setItems = (uuid, id, stage) => {
  return items[uuid].push({ id, stage });
};

export const clearItems = (uuid) => {
  items[uuid] = [];
};

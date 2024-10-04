const stages = {};

export const createStage = (uuid) => {
  stages[uuid] = [];
  console.log("stages LIST");
  console.log(stages);
};

export const getStage = (uuid) => {
  return stages[uuid];
};

export const setStage = (uuid, id, timestamp) => {
  return stages[uuid].push({ id, timestamp });
};

export const clearStage = (uuid) => {
  stages[uuid] = [];
};

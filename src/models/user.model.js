const users = [];

export const addUser = (user) => {
  users.push(user);
};

export const getUser = () => {
  return users;
};

export const removeUser = (socketId) => {
  const idx = users.findIndex((user) => user.socketId === socketId);
  if (idx !== -1) return users.splice(idx, 1)[0];
};

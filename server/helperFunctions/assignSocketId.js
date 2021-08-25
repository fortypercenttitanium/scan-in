const { nanoid } = require('nanoid');

module.exports = function assignSocketId(socket) {
  socket.id = nanoid();
};

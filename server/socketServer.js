const WebSocket = require('ws');
const SocketMessage = require('./classes/SocketMessage');
const attachSocketListeners = require('./helperFunctions/attachSocketListeners');
const assignSocketId = require('./helperFunctions/assignSocketId');

const wss = new WebSocket.Server({
  port: 5001,
});

wss.on('connection', (socket) => {
  attachSocketListeners(socket);
  assignSocketId(socket);

  console.log(`New socket connection: ${socket.id}`);
});

module.exports = wss;

const express = require('express');
const app = express();
const passport = require('./auth/passport');
const WebSocket = require('ws');
const SocketMessage = require('./classes/SocketMessage');
const SessionList = require('./classes/SessionList');
const attachSocketListeners = require('./helperFunctions/attachSocketListeners');
const assignSocketId = require('./helperFunctions/assignSocketId');

const PORT = process.env.SOCKET_PORT || 5001;

const server = app.listen(PORT, () =>
  console.log(`Socket server listening on port ${PORT}...`),
);

const wss = new WebSocket.Server({
  server,
});

const sessionList = new SessionList();

wss.on('connection', (socket, req) => {
  attachSocketListeners(socket);
  assignSocketId(socket);
  const cookies = req.headers.cookie?.split(';').reduce((acc, val) => {
    const [key, value] = val.trim().split('=');
    return { ...acc, [key]: value };
  }, {});
  req.cookies = cookies;

  console.log(`New socket connection: ${socket.id}`);
});

server.on('upgrade', (req, socket, head) => {
  passport.authenticate('jwt', (err, user, info) => {
    if (err || !user) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
    }
    req.user = user;
  })(req);
});

module.exports = wss;

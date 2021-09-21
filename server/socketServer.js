const express = require('express');
const app = express();
const passport = require('./auth/passport');
const WebSocket = require('ws');
const SocketMessage = require('./classes/SocketMessage');
const SessionList = require('./classes/SessionList');
const attachSocketListeners = require('./helperFunctions/attachSocketListeners');
const assignSocketId = require('./helperFunctions/assignSocketId');
const socketCookieParser = require('./helperFunctions/socketCookieParser');

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

  // custom cookie parser
  req.cookies = socketCookieParser(req);

  passport.authenticate('jwt', (err, user, info) => {
    if (err || !user) {
      socket.send('closing');
      socket.close(4000, 'Unauthorized');
    }
    req.user = user;
  })(req);

  console.log(`New socket connection: ${socket.id}`);
});

module.exports = wss;

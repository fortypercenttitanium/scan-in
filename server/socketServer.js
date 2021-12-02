const express = require('express');
const app = express();
const passport = require('./auth/passport');
const WebSocket = require('ws');
const SocketMessage = require('./classes/SocketMessage');
const attachSocketListeners = require('./helperFunctions/attachSocketListeners');
const assignSocketId = require('./helperFunctions/assignSocketId');
const socketCookieParser = require('./helperFunctions/socketCookieParser');

const PORT = process.env.SOCKET_PORT || 5001;

// const server = app.listen(PORT, () =>
//   console.log(`Socket server listening on port ${PORT}...`),
// );

// const wss = new WebSocket.Server({
//   server,
// });

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (socket, req) => {
  // custom cookie parser
  req.cookies = socketCookieParser(req);

  passport.authenticate('jwt', (err, user, info) => {
    if (err || !user) {
      socket.send('closing');
      socket.close(4000, 'Unauthorized');
    } else {
      socket.owner = user.id;
      assignSocketId(socket);
      attachSocketListeners(socket);

      console.log(`New socket connection: ${socket.id}`);

      const connectedMessage = new SocketMessage({
        sender: 'server',
        message: { event: 'socket-connected', payload: {} },
      });

      socket.send(connectedMessage.toJSON());
    }
  })(req);
});

module.exports = wss;

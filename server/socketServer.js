import { WebSocketServer } from 'ws';
import passport from './auth/passport.js';
import SocketMessage from './classes/SocketMessage.js';
import attachSocketListeners from './helperFunctions/attachSocketListeners.js';
import assignSocketId from './helperFunctions/assignSocketId.js';
import socketCookieParser from './helperFunctions/socketCookieParser.js';

const PORT = process.env.SOCKET_PORT || 5001;

const wss = new WebSocketServer({ noServer: true });

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', (socket, req) => {
  socket.isAlive = true;
  socket.on('pong', heartbeat);

  // custom cookie parser
  req.cookies = socketCookieParser(req);

  passport.authenticate('jwt', (err, user, info) => {
    if (err || !user) {
      socket.send(
        new SocketMessage({
          sender: 'server',
          message: {
            event: 'socket-closed',
            payload: {
              err,
            },
          },
        }).toJSON(),
      );
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

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
  });
}, 10000);

wss.on('close', function close() {
  clearInterval(interval);
});

export default wss;

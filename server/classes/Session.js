const { nanoid } = require('nanoid');
const SocketMessage = require('./SocketMessage');

module.exports = class Session {
  constructor(owner, socket) {
    this.owner = owner;
    this.sockets = [socket];
    this.id = nanoid();
    const now = new Date().getTime();
    this.expires = now + 2 * 60 * 60 * 1000;

    socket.send({ event: 'session-opened', payload: {} });
  }

  closeSession = () => {
    console.log('closing session');
  };
};

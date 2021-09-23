const { nanoid } = require('nanoid');
const SocketMessage = require('./SocketMessage');
const query = require('../helperFunctions/queryHelper');
const { gql } = require('graphql-request');

module.exports = class Session {
  #sockets;
  #log;

  constructor(socket, sessionData) {
    this.owner = socket.owner;
    this.classID = sessionData.classID;
    this.#sockets = [socket];
    this.#log = [];
    this.id = nanoid();
    const now = new Date().getTime();
    this.expires = now + 2 * 60 * 60 * 1000;
  }

  async init() {
    try {
      const NEW_SESSION = gql`
      mutation ($classID = ID!) {
        addSession (classID: $classID) {
          id
          classID
          startTime
          endTime
          students {
            id
            firstName
            lastName
          }
        }
      }
    `;

      const session = await query(NEW_SESSION, {
        classID: this.classID,
      });

      console.log(session);

      const openMessage = new SocketMessage({
        sender: 'server',
        message: {
          event: 'session-opened',
          payload: { id: this.id, studentList },
        },
      });
      socket.send(openMessage.toJSON());
    } catch (err) {
      console.error(err);
    }
  }

  addSubscriber(socket) {
    this.#sockets.push(socket);
  }

  removeSubscriber(socket) {
    const filtered = this.sockets.filter((socketID) => socketID !== socket);
    this.sockets = filtered;
  }

  async scanIn(studentID) {
    if (this.studentList.includes(studentID)) {
    }
  }

  broadcastMessage(message) {
    message.validateMessage();
    this.#sockets.forEach((socket) => socket.send(message.toJSON()));
  }

  closeSession = () => {
    // todo: close session in db
    this.#sockets.forEach((socket) => socket.close(1000, 'Session closed'));
    console.log('closing session ' + this.id);
  };
};

const { nanoid } = require('nanoid');
const SocketMessage = require('./SocketMessage');
const query = require('../helperFunctions/queryHelper');
const { gql } = require('graphql-request');

module.exports = class Session {
  #sockets;
  #log;

  constructor(socket, classID) {
    this.owner = socket.owner;
    this.classID = classID;
    this.#sockets = [socket];
    this.#log = [];
    this.id = nanoid();
    const now = new Date().getTime();
    this.expires = now + 2 * 60 * 60 * 1000;
  }

  async init() {
    try {
      const NEW_SESSION = gql`
        mutation ($classID: ID!) {
          addSession(classID: $classID) {
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

      const openMessage = new SocketMessage({
        sender: 'server',
        message: {
          event: 'session-opened',
          payload: { id: session.id },
        },
      });

      this.broadcastMessage(openMessage);
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
      const SCAN_IN = gql`
        mutation ($payload: String!) {
          addLogEntry(payload: $payload) {
            timeStamp
            event
            payload
          }
        }
      `;

      const newSessionData = await query(SCAN_IN, { payload: studentID });

      const successMessage = new SocketMessage({
        sender: 'server',
        message: {
          event: 'session-update',
          payload: newSessionData,
        },
      });

      return this.broadcastMessage(successMessage);
    }
    const failMessage = new SocketMessage({
      sender: 'server',
      message: {
        event: 'scan-failed',
        payload: { message: `Student ID #${studentID} not found in class.` },
      },
    });

    return this.broadcastMessage(failMessage);
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

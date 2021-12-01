const { nanoid } = require('nanoid');
const SocketMessage = require('./SocketMessage');
const query = require('../helperFunctions/queryHelper');
const { gql } = require('graphql-request');

module.exports = class Session {
  #sockets;
  #log;
  #studentList;

  constructor(socket, classID) {
    this.owner = socket.owner;
    this.classID = classID;
    this.#sockets = [socket];
    this.#log = [];
    this.#studentList = [];
    const now = new Date().getTime();
    this.expires = now + 2 * 60 * 60 * 1000;
  }

  async init(sessionID) {
    try {
      let sessionData;

      // if session already exists
      if (sessionID) {
        const SESSION_IN_PROGRESS = gql`
          query ($id: ID!) {
            session(id: $id) {
              id
              classID
              className
              startTime
              endTime
              log {
                event
                payload
                timeStamp
              }
              students {
                id
                firstName
                lastName
              }
            }
          }
        `;

        const result = await query(SESSION_IN_PROGRESS, {
          id: sessionID,
        });

        sessionData = result.session;
      } else {
        const NEW_SESSION = gql`
          mutation ($classID: ID!) {
            addSession(classID: $classID) {
              id
              classID
              className
              startTime
              endTime
              log {
                event
                payload
                timeStamp
              }
              students {
                id
                firstName
                lastName
              }
            }
          }
        `;

        const result = await query(NEW_SESSION, {
          classID: this.classID,
        });

        sessionData = result.addSession;
      }

      this.id = sessionData.id;
      this.#studentList = [...sessionData.students];

      const openMessage = new SocketMessage({
        sender: 'server',
        message: {
          event: 'session-opened',
          payload: sessionData,
        },
      });

      this.broadcastMessage(openMessage);
    } catch (err) {
      console.error(err);
    }
  }

  async addSubscriber(socket) {
    // todo: check if sockets are disconnected when returning to class screen
    // check if the subscriber is already subscribed
    if (!this.#sockets.find((listSocket) => listSocket.id === socket.id)) {
      this.#sockets.push(socket);

      const GET_SESSION_DATA = gql`
        query ($id: ID!) {
          session(id: $id) {
            id
            classID
            className
            startTime
            endTime
            log {
              event
              payload
              timeStamp
            }
            students {
              id
              firstName
              lastName
            }
          }
        }
      `;

      const sessionData = await query(GET_SESSION_DATA, {
        id: this.id,
      });

      this.broadcastMessage(
        new SocketMessage({
          sender: 'server',
          message: {
            event: 'session-joined',
            payload: sessionData.session,
          },
        }),
      );
    }
  }

  removeSubscriber(socket) {
    const filtered = this.sockets.filter((socketID) => socketID !== socket);
    this.sockets = filtered;
  }

  async scanIn(studentID) {
    if (this.#studentList.some((student) => student.id === studentID)) {
      const SCAN_IN = gql`
        mutation ($payload: String!, $sessionID: ID!) {
          addLogEntry(
            payload: $payload
            sessionID: $sessionID
            event: "scan-in"
          ) {
            id
            classID
            startTime
            endTime
            log {
              event
              payload
              timeStamp
            }
            students {
              id
              firstName
              lastName
            }
          }
        }
      `;

      const newSessionData = await query(SCAN_IN, {
        payload: studentID,
        sessionID: this.id,
      });

      const successMessage = new SocketMessage({
        sender: 'server',
        message: {
          event: 'session-update',
          payload: newSessionData.addLogEntry,
        },
      });

      return this.broadcastMessage(successMessage);
    }
    const failMessage = new SocketMessage({
      sender: 'server',
      message: {
        event: 'scan-fail',
        payload: { message: `Student ID #${studentID} not found in class.` },
      },
    });

    return this.broadcastMessage(failMessage);
  }

  broadcastMessage(message) {
    message.validateMessage();
    this.#sockets.forEach((socket) => socket.send(message.toJSON()));
  }

  closeSession = async () => {
    const CLOSE_SESSION = gql`
      mutation ($id: ID!) {
        closeSession(id: $id) {
          id
          classID
          className
          startTime
          endTime
          log {
            event
            payload
            timeStamp
          }
          students {
            id
            firstName
            lastName
          }
        }
      }
    `;

    const sessionData = await query(CLOSE_SESSION, { id: this.id });

    this.broadcastMessage(
      new SocketMessage({
        sender: 'server',
        message: {
          event: 'session-closed',
          payload: sessionData.closeSession,
        },
      }),
    );

    this.#sockets.forEach((socket) => socket.close(1000, 'Session closed'));
    console.log('closing session ' + this.id);
  };
};

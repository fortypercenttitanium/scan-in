const SocketMessage = require('../classes/SocketMessage');
const SessionList = require('../classes/SessionList');
const logMessage = require('./logMessage');

const sessionList = new SessionList();

module.exports = function attachSocketListeners(socket) {
  function createSession({ classID }) {
    sessionList.createSession(socket, classID);
  }

  async function handleScanIn({ sessionID, studentID }) {
    try {
      if (sessionList.sessions[sessionID]) {
        await sessionList.sessions[sessionID].scanIn(studentID);
      } else {
        const notFoundMessage = new SocketMessage({
          sender: 'server',
          message: {
            event: 'session-not-found',
            payload: sessionID,
          },
        });

        socket.send(notFoundMessage.toJSON());
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async function closeSession({ sessionID }) {
    await sessionList.closeSession(sessionID);
  }

  socket.on('message', (message) => {
    logMessage(socket, message);
    try {
      let parsedMessage;

      try {
        parsedMessage = JSON.parse(message);
      } catch {
        throw new Error('Message is not valid JSON.');
      }

      const receivedMessage = new SocketMessage({
        sender: socket.id,
        user: socket.owner,
        message: parsedMessage,
      });

      receivedMessage.validateMessage(socket);
      const { event, payload } = receivedMessage.message;

      switch (event) {
        case 'new-session':
          createSession(payload);
          break;
        case 'scan-in':
          handleScanIn(payload);
          break;
        case 'close-session':
          closeSession(payload);
          break;
        default:
          break;
      }
    } catch (err) {
      socket.send(JSON.stringify(err.message));
      console.error(err);
    }
  });
};

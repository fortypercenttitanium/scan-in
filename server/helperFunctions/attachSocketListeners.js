const SocketMessage = require('../classes/SocketMessage');
const SessionList = require('../classes/SessionList');
const logMessage = require('./logMessage');

const sessionList = new SessionList();

module.exports = function attachSocketListeners(socket) {
  function createSession({ classID }) {
    sessionList.createSession(socket, classID);
  }

  async function handleScanIn({ sessionID, studentID }) {
    await sessionList[sessionID].scanIn(studentID);
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
        default:
          break;
      }
    } catch (err) {
      socket.send(JSON.stringify(err.message));
      console.error(err);
    }
  });
};

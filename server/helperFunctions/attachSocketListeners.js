const SocketMessage = require('../classes/SocketMessage');
const MessageHandler = require('../classes/MessageHandler');

module.exports = function attachSocketListeners(socket) {
  socket.on('message', (message) => {
    console.log('Received message from ' + socket.id);
    console.log(message.toString());
    let parsedMessage;
    try {
      try {
        parsedMessage = JSON.parse(message);
      } catch {
        throw new Error('Message is not valid JSON.');
      }
      const receivedMessage = new SocketMessage({
        sender: socket.id,
        message: parsedMessage,
      });
      receivedMessage.validateMessage();

      const messageHandler = new MessageHandler(receivedMessage);
      messageHandler.handleMessage();
    } catch ({ message }) {
      socket.send(JSON.stringify(message));
    }
  });
};

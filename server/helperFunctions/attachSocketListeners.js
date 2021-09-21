const SocketMessage = require('../classes/SocketMessage');
const MessageHandler = require('../classes/MessageHandler');

module.exports = function attachSocketListeners(socket) {
  socket.on('message', (message) => {
    let parsedMessage;
    console.log(JSON.parse(message));
    try {
      parsedMessage = JSON.parse(message);
    } catch {
      throw new Error('Message is not valid JSON');
    }

    const socketMessage = new SocketMessage({
      sender: socket.id,
      message: parsedMessage,
    });

    socketMessage.validateMessage();

    console.log(socketMessage);

    const messageHandler = new MessageHandler(socketMessage);
    messageHandler.handleMessage();
  });
};

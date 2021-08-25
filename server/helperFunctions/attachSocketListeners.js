const SocketMessage = require('../classes/SocketMessage');
module.exports = function attachSocketListeners(socket) {
  socket.on('message', (message) => {
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
    } catch {
      throw new Error('Message is not valid JSON');
    }

    const socketMessage = new SocketMessage({
      sender: socket.id,
      message: parsedMessage,
    });

    console.log(socketMessage);

    socketMessage.validateMessage();
  });
};

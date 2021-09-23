class SocketMessage {
  constructor({ sender, message, user }) {
    this.sender = sender;
    this.message = message;
    this.user = user || null;
  }

  validateMessage = (socket) => {
    if (!this.message || !this.message.event || !this.message.payload) {
      const error = `Invalid message from "${this.sender}": "${JSON.stringify(
        message,
      )}"`;

      const message = { event: 'error', payload: { errorMessage: error } };
      socket.send(JSON.stringify(message));

      throw new Error(error);
    }
  };

  toJSON() {
    return JSON.stringify({ sender: this.sender, message: this.message });
  }
}

module.exports = SocketMessage;

class SocketMessage {
  constructor({ sender, message, user }) {
    this.sender = sender;
    this.message = message;
    this.user = user || null;
  }

  validateMessage = () => {
    if (!this.message || !this.message.event || !this.message.payload) {
      throw new Error(
        `Invalid message from "${this.sender}": "${JSON.stringify(message)}"`,
      );
    }
  };

  toJSON() {
    return JSON.stringify({ sender: this.sender, message: this.message });
  }
}

module.exports = SocketMessage;

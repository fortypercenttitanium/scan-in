class SocketMessage {
  constructor({ sender, message }) {
    this.sender = sender;
    this.message = message;
  }

  validateMessage() {
    if (typeof this.message.event !== 'string') {
      throw new Error(
        'Invalid event property for message. Event must be of type string.',
      );
    }

    if (!this.sender) {
      throw new Error('No sender included with message.');
    }

    if (!this.message.hasOwnProperty('payload')) {
      throw new Error('Missing payload property for message.');
    }
  }

  toJSON() {
    return JSON.stringify({ sender: this.sender, message: this.message });
  }
}

module.exports = SocketMessage;

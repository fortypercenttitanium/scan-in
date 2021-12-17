export default class SocketMessage {
  constructor({ sender, message, user }) {
    this.sender = sender;
    this.message = message;
    this.user = user || null;
  }

  validateMessage = () => {
    if (!this.message || !this.message.event || !this.message.payload) {
      const error = `Invalid message from "${this.sender}": "${JSON.stringify(
        this.message,
      )}"`;

      throw new Error(error);
    }
  };

  toJSON() {
    return JSON.stringify({ sender: this.sender, message: this.message });
  }
}

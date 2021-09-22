const { sessionList } = require('../socketServer');

module.exports = class MessageHandler {
  constructor({ sender, message, user }) {
    this.sender = sender;
    this.message = message;
    this.user = user || null;
  }

  handleMessage() {
    console.log('Handling message: ', this.message);
    switch (this.message.event) {
      case 'new-session':
        this.createSession(this.user, this.message.payload);
        break;
      case 'scan-in':
        this.handleScanIn(this.message.payload);
        break;
      default:
        break;
    }
  }

  handleScanIn(payload) {
    console.log('handling scan-in: ', payload);
  }

  createSession(user, sessionData) {
    console.log('new session for user: ', user);
    console.log('session class: ', sessionData.class);
  }
};

module.exports = class MessageHandler {
  constructor({ sender, message }) {
    this.sender = sender;
    this.message = message;
  }

  handleMessage() {
    console.log('Handling message: ', this.message);
    switch (this.message.event) {
      case 'NEW_SESSION':
        this.createNewSession(this.message.payload);
      case 'SIGN_IN':
        this.handleSignIn(this.message.payload);
      default:
        break;
    }
  }

  handleSignIn(payload) {
    console.log('handling sign-in: ', payload);
  }

  createSession(sessionData) {
    console.log('new session: ', sessionData);
  }
};

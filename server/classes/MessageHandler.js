module.exports = class MessageHandler {
  constructor({ sender, message }) {
    this.sender = sender;
    this.message = message;
  }

  handleMessage() {
    console.log('Handling message: ', this.message);
    switch (this.message.event) {
      case 'SIGN_IN':
        this.handleSignIn(this.message.payload);
      default:
        break;
    }
  }

  handleSignIn(payload) {
    console.log('handling sign-in: ', payload);
  }
};

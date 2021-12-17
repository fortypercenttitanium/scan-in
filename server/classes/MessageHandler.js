module.exports = class MessageHandler {
  constructor(socket, { sender, message, user }) {
    this.socket = socket;
    this.sender = sender;
    this.message = message;
    this.user = user || null;
  }

  handleMessage() {
    console.log('Handling message: ', this.message);
    switch (this.message.event) {
      case 'new-session':
        this.createSession(this.socket, this.message.payload);
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

    const sessionID = payload.sessionID;
    const studentID = payload.studentID;
    const timestamp = Date.now().getTime();
  }

  createSession(socket, sessionList) {
    // todo: get all class details
    sessionList.createSession(sessionData);
  }
};

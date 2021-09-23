const Session = require('./Session');

module.exports = class SessionList {
  constructor() {
    this.sessions = {};
    setInterval(() => {
      this.closeExpiredSessions();
    }, 60000);
  }

  createSession = async (ownerSocket, classID) => {
    console.log('class ID', classID);
    const existingSessions = Object.keys(this.sessions).filter(
      (session) => this.sessions[session].owner === ownerSocket.id,
    );
    if (existingSessions.length) {
      throw new Error(
        `Owner already has an active session. Close open session ${existingSessions[0].id} before opening a new session.`,
      );
    }

    const session = new Session(ownerSocket, classID);
    await session.init();
    this.sessions[session.id] = session;
  };

  closeSession = (id) => {
    if (this.sessions[id]) {
      this.sessions[id].closeSession();
      delete this.sessions[id];
    } else {
      throw new Error(`Session ${id} does not exist.`);
    }
  };

  closeExpiredSessions = () => {
    const now = new Date().getTime();
    const expiredSessions = Object.keys(this.sessions).filter(
      (session) => this.sessions[session].expires <= now,
    );

    expiredSessions.forEach((session) => this.closeSession(session));
  };
};

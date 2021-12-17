import Session from './Session.js';
import { gql } from 'graphql-request';
import query from '../helperFunctions/queryHelper.js';

export default class SessionList {
  constructor() {
    this.sessions = {};
    setInterval(() => {
      this.closeExpiredSessions();
    }, 60000);
  }

  createSession = async (ownerSocket, classID) => {
    try {
      // check db for open sessions
      const SESSION_LIST = gql`
        query ($userID: ID!) {
          sessionList(userID: $userID) {
            id
            className
            startTime
            endTime
            classID
            log {
              event
              payload
              timeStamp
            }
          }
        }
      `;

      const result = await query(SESSION_LIST, { userID: ownerSocket.owner });

      const openSessions = result.sessionList.filter(
        (session) => Number(session.endTime) > Number(new Date().getTime()),
      );

      // if open sessions, check session list for session
      if (openSessions.length) {
        const openSession = openSessions[0];

        if (this.sessions[openSession.id]) {
          // if in session list, add subscriber
          return this.sessions[openSession.id].addSubscriber(ownerSocket);
        } else {
          // if not in session list, initialize socket
          const session = new Session(ownerSocket, classID);
          await session.init(openSession.id);
          this.sessions[openSession.id] = session;
          return;
        }
      }

      // if no open sessions, open session regularly
      const session = new Session(ownerSocket, classID);
      await session.init();

      this.sessions[session.id] = session;
    } catch (err) {
      console.error(err);
    }
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
}

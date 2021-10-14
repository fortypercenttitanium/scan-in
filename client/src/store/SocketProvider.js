import React, { createContext, useState } from 'react';
import getLogTime from '../helperFunctions/getLogTime';
export const SocketStore = createContext();
let socket;

function SocketProvider({ children }) {
  const [sessionData, setSessionData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState('');

  function init(classID) {
    console.log(`Initializing class session: ${classID}`);
    socket = new WebSocket('ws://localhost:5001');

    socket.onmessage = (message) => {
      const messageData = JSON.parse(message.data);
      console.log('message received: ', messageData);

      const { event, payload } = messageData.message;

      if (event === 'socket-connected') {
        socket.send(
          JSON.stringify({
            event: 'new-session',
            payload: { classID },
          }),
        );
      }

      if (event === 'session-update') {
        setSessionData({
          ...sessionData,
          ...payload,
        });

        // set the update message
        const studentID = payload.log[payload.log.length - 1].payload;
        const student = payload.students.find(
          (student) => student.id === studentID,
        );

        setLastUpdate(
          `${student.firstName} ${student.lastName} scanned in at ${getLogTime(
            payload.log,
          )}`,
        );
      }

      if (event === 'session-opened') {
        setLastUpdate(`Session opened at ${getLogTime(payload.log)}`);
        setSessionData(payload);
      }

      if (event === 'scan-fail') {
        setLastUpdate(`Scan failed: ${payload.message}`);
      }
    };

    if (process.env.NODE_ENV === 'development') {
      window.socket = socket;
    }
  }

  function scanIn(studentID) {
    const message = {
      event: 'scan-in',
      payload: { studentID, sessionID: sessionData.id },
    };

    socket.send(JSON.stringify(message));
  }

  return (
    <SocketStore.Provider value={{ init, sessionData, scanIn, lastUpdate }}>
      {children}
    </SocketStore.Provider>
  );
}

export default SocketProvider;

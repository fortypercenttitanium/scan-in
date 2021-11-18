import React, { createContext, useState, useEffect } from 'react';
import getLogTime from '../helperFunctions/getLogTime';
import convertLogToStudentStatus from '../helperFunctions/convertLogToStudentStatus';
export const SocketStore = createContext();
let socket;

const noop = () => {};

function SocketProvider({ children }) {
  const [sessionData, setSessionData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState('');
  const [studentStatus, setStudentStatus] = useState([]);

  // Create useable student data
  useEffect(() => {
    if (sessionData && sessionData.students?.length) {
      const students = convertLogToStudentStatus(sessionData);

      setStudentStatus(students);
    }
  }, [sessionData]);

  function init(classID, onCloseCallback) {
    console.log(`Initializing class session: ${classID}`);
    socket = new WebSocket('ws://localhost:5001');

    socket.onmessage = (message) => {
      const messageData = JSON.parse(message.data);
      console.log('message received: ', messageData);

      const { event, payload } = messageData.message;

      // todo: check for existing session
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
        console.log(`Scan failed: ${payload.message}`);
        setLastUpdate(`Scan failed: ${payload.message}`);
      }
    };

    socket.onclose = onCloseCallback || noop;

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

  function closeSession() {
    socket.send(
      JSON.stringify({
        event: 'close-session',
        payload: { sessionID: sessionData.id },
      }),
    );
  }

  return (
    <SocketStore.Provider
      value={{
        init,
        sessionData,
        scanIn,
        lastUpdate,
        studentStatus,
        closeSession,
      }}
    >
      {children}
    </SocketStore.Provider>
  );
}

export default SocketProvider;

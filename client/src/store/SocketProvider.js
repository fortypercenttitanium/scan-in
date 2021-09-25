import React, { createContext, useState, useEffect } from 'react';
export const SocketStore = createContext();

function SocketProvider({ children }) {
  const [sessionData, setSessionData] = useState(null);

  // let socket;

  function init(classID) {
    const socket = new WebSocket('ws://localhost:5001');

    socket.onmessage = (message) => {
      const messageData = JSON.parse(message.data);
      console.log('message received: ', messageData);

      const { event, payload } = messageData.message;

      if (event === 'socket-connected') {
        socket.send(
          JSON.stringify({
            event: 'new-session',
            payload: { classID: 'EHdw_GkMqMXW_4a0BQiAn' },
          }),
        );
      }

      if (event === 'session-update') {
        setSessionData({
          ...sessionData,
          ...payload,
        });
      }

      if (event === 'session-opened') {
        setSessionData(payload);
      }
    };

    if (process.env.NODE_ENV === 'development') {
      window.socket = socket;
    }
  }

  return (
    <SocketStore.Provider value={{ init, sessionData }}>
      {children}
    </SocketStore.Provider>
  );
}

export default SocketProvider;

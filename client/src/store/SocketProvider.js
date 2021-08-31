import React, { createContext, useState, useEffect } from 'react';
export const SocketStore = createContext();

const socket = new WebSocket('ws://localhost:5001');

function SocketProvider({ children }) {
  const [sessionLog, setSessionLog] = useState([]);

  useEffect(() => {
    const noop = () => {};
    socket.onmessage = (message) => {
      console.log('message received: ', message);

      if (message.event === 'UPDATE_LOG') {
        setSessionLog(message.payload);
      }
    };
    return () => {
      socket.onopen = noop;
    };
  });

  const sendMessage = (message) => {
    socket.send(JSON.stringify(message));
  };

  return (
    <SocketStore.Provider value={{ sessionLog, sendMessage }}>
      {children}
    </SocketStore.Provider>
  );
}

export default SocketProvider;

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SocketStore } from '../../store/SocketProvider';
import SessionDashboard from '../SessionDashboard';

function SessionLayout() {
  const [sessionOpened, setSessionOpened] = useState(false);
  const { id } = useParams();
  const { init, socket, sessionData } = useContext(SocketStore);

  useEffect(() => {
    if (!sessionOpened) {
      setSessionOpened(true);
      init(id);
    }
  }, [init, id, sessionOpened]);

  return sessionOpened ? <SessionDashboard id={id} /> : <div>Loading...</div>;
}

export default SessionLayout;

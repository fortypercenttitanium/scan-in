import React, { useEffect, useState, useContext } from 'react';
import { Button, Box } from '@mui/material';
import Scanner from '../Scanner';
import SocketProvider, { SocketStore } from '../../store/SocketProvider';
import ClassList from '../ClassList';

//placeholder
function SessionDashboard() {
  return <div>Dashboard</div>;
}

function SessionLayout() {
  const [sessionOpened, setSessionOpened] = useState(false);

  const { init, socket, sessionData } = useContext(SocketStore);

  function handleClassSubmit(selectedClass) {
    init();
  }

  return sessionOpened ? (
    <SessionDashboard />
  ) : (
    <ClassList onSubmit={handleClassSubmit} />
  );
}

export default SessionLayout;

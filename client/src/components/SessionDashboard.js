import React, { useState, useEffect, useContext } from 'react';
import { SocketStore } from '../store/SocketProvider';
import Paper from '@mui/material/Paper';
import Numpad from './Numpad';

function SessionDashboard() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { lastUpdate } = useContext(SocketStore);

  useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
      }
    });
  }, []);

  function toggleFullscreen() {
    const element = document.querySelector('.fullscreen');
    if (document.fullscreenElement) {
      return document.exitFullscreen();
    }
    return element.requestFullscreen();
  }

  return (
    <Paper
      sx={{
        m: 'auto',
        p: 8,
        maxWidth: 'md',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
      elevation={3}
      className="fullscreen"
    >
      <p>Last update: {lastUpdate}</p>
      <Numpad isFullscreen={isFullscreen} toggleFullscreen={toggleFullscreen} />
    </Paper>
  );
}

export default SessionDashboard;

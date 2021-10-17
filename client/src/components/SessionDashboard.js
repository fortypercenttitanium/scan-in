import React, { useState, useEffect, useContext } from 'react';
import { SocketStore } from '../store/SocketProvider';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import Numpad from './Numpad';

function SessionDashboard() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { lastUpdate } = useContext(SocketStore);

  const matches = useMediaQuery('(max-width:768px)');

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
    <Box
      sx={{
        m: 2,
        border: '1px solid red',
        gap: '12px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: '1' }}
      >
        <Typography variant="p" sx={{ m: 4 }}>
          Back to classes
        </Typography>
        <Box sx={{ display: 'block', textAlign: 'center' }}>
          <h1>Class Name</h1>
          <h2>Date</h2>
          <h3>Time</h3>
        </Box>
        <Typography variant="p" sx={{ m: 4 }}>
          Settings
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexGrow: '3', gap: '4px' }}>
        <Box
          sx={{
            display: matches ? 'none' : 'grid',
            gridTemplate: '1fr 3fr 1fr / 3fr 4fr',
            mx: 3,
            width: '100%',
          }}
        >
          <Box>
            <p>Present:</p>
            <p>Absent:</p>
          </Box>
          <Box>
            <h3>Sign-in deadline: 10:30am</h3>
          </Box>
          <Box sx={{ gridColumnEnd: 'span 2', border: '1px solid blue', m: 1 }}>
            Student list
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <p>Sign in expires: 12:30pm</p>
            <p>Change expiration time in settings</p>
          </Box>
          <Box sx={{ my: 1, mx: 'auto' }}>
            <Stack direction="row" spacing={3}>
              <Button variant="contained">Close attendance session</Button>
              <Button variant="contained">Export to csv</Button>
            </Stack>
          </Box>
        </Box>
        <Paper
          sx={{
            my: 'auto',
            mx: matches ? 'auto' : 6,
            px: 10,
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            textAlign: 'center',
          }}
          elevation={3}
          className="fullscreen"
        >
          <p>Last update: {lastUpdate}</p>
          <Numpad
            isFullscreen={isFullscreen}
            toggleFullscreen={toggleFullscreen}
          />
        </Paper>
      </Box>
    </Box>
  );
}

export default SessionDashboard;

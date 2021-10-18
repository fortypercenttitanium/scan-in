import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SocketStore } from '../../store/SocketProvider';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import Numpad from '../Numpad';
import SessionStudentList from '../SessionStudentList';

function SessionLayout() {
  const [sessionOpened, setSessionOpened] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { id } = useParams();
  const { init, lastUpdate, studentStatus } = useContext(SocketStore);

  const matches = useMediaQuery('(max-width:768px)');

  useEffect(() => {
    if (!sessionOpened) {
      setSessionOpened(true);
      init(id);
    }
  }, [init, id, sessionOpened]);

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

  return sessionOpened ? (
    <Box
      sx={{
        m: 2,
        border: '1px solid red',
        gap: '12px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '800px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          maxHeight: '20%',
        }}
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
      <Box sx={{ display: 'flex', gap: '4px', maxHeight: '80%' }}>
        <Box
          sx={{
            display: matches ? 'none' : 'grid',
            gridTemplate: '1fr 3fr 1fr / 3fr 4fr',
            mx: 3,
            width: '100%',
          }}
        >
          <Box>
            <p>
              Present:{' '}
              {
                studentStatus.filter((student) => student.status === 'present')
                  .length
              }
            </p>
            <p>
              Absent:{' '}
              {
                studentStatus.filter((student) => student.status === 'absent')
                  .length
              }
            </p>
          </Box>
          <Box>
            <h3>Sign-in deadline: 10:30am</h3>
          </Box>
          <SessionStudentList data={studentStatus} />
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
          <Typography variant="p" sx={{ mx: 'auto', mb: 2, mt: 'auto' }}>
            Last update: {lastUpdate}
          </Typography>
          <Numpad
            isFullscreen={isFullscreen}
            toggleFullscreen={toggleFullscreen}
          />
        </Paper>
      </Box>
    </Box>
  ) : (
    <div>Loading...</div>
  );
}

export default SessionLayout;

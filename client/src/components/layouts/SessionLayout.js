import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { SocketStore } from '../../store/SocketProvider';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import Numpad from '../Numpad';
import SessionStudentList from '../SessionStudentList';
// import bySignIn from '../../helperFunctions/listSorters/bySignIn';
import byName from '../../helperFunctions/listSorters/byName';

function SessionLayout() {
  const [sessionOpened, setSessionOpened] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { id } = useParams();
  const { init, lastUpdate, studentStatus } = useContext(SocketStore);

  const history = useHistory();

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

  function handleClickBack() {
    history.push('/dashboard');
  }

  return sessionOpened ? (
    <Paper
      sx={{
        m: 2,
        p: 2,
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
          alignItems: 'center',
          mx: 3,
        }}
      >
        <Link to="/dashboard">
          <Typography variant="p">&lt; Back to classes</Typography>
        </Link>
        <Box sx={{ display: 'block', textAlign: 'center' }}>
          <h1>Class Name</h1>
          <h2>Date</h2>
          <h3>Time</h3>
        </Box>
        <Link to="#">
          <Typography variant="p">Settings</Typography>
        </Link>
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
          <SessionStudentList data={byName(studentStatus, 'last')} />
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
    </Paper>
  ) : (
    <div>Loading...</div>
  );
}

export default SessionLayout;

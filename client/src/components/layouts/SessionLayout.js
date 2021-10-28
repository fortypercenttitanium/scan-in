import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { SocketStore } from '../../store/SocketProvider';
import grey from '@mui/material/colors/grey';
import green from '@mui/material/colors/green';
import red from '@mui/material/colors/red';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import Numpad from '../Numpad';
import SessionStudentList from '../SessionStudentList';
import bySignIn from '../../helperFunctions/listSorters/bySignIn';
import byName from '../../helperFunctions/listSorters/byName';

function SessionLayout() {
  const [sessionOpened, setSessionOpened] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [clock, setClock] = useState(new Date().toLocaleTimeString());
  const { id } = useParams();
  const { init, lastUpdate, studentStatus, sessionData, closeSession } =
    useContext(SocketStore);

  const history = useHistory();

  const matches = useMediaQuery('(max-width:768px)');

  function lastUpdateColor(status) {
    if (status.includes('scanned in')) {
      return green[100];
    } else if (status.includes('failed')) {
      return red[100];
    }

    return 'inherit';
  }

  // tick clock
  useEffect(() => {
    setInterval(() => {
      setClock(new Date().toLocaleTimeString());
    }, 1000);
  }, []);

  useEffect(() => {
    function onCloseCallback() {
      history.push('/dashboard');
    }
    if (!sessionOpened) {
      init(id, onCloseCallback);
    }
  }, [init, id, sessionOpened, history]);

  useEffect(() => {
    if (sessionData) {
      setSessionOpened(true);
    }
  }, [sessionData]);

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
        mx: 0,
        mt: 2,
        p: 2,
        gap: '12px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '800px',
        backgroundColor: grey[200],
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
          <h1>{sessionData.className}</h1>
          <h2>{new Date().toLocaleDateString()}</h2>
          <h3>{clock}</h3>
        </Box>
        <Link to="#">
          <Typography variant="p">Settings</Typography>
        </Link>
      </Box>
      <Box sx={{ display: 'flex', gap: '4px', maxHeight: '80%' }}>
        <Box
          sx={{
            display: matches ? 'none' : 'grid',
            gridTemplate: '1fr 8fr 1fr / 3fr 4fr',
            mx: 3,
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: 2,
            }}
          >
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
          <Box sx={{ textAlign: 'center' }}>
            {/* <h3>Sign-in deadline: 10:30am</h3> */}
          </Box>
          <SessionStudentList
            data={bySignIn(byName(studentStatus, 'last'), 'present')}
          />
          <Box sx={{ textAlign: 'center' }}>
            {/* <p>Sign in expires: 12:30pm</p>
            <p>Change expiration time in settings</p> */}
          </Box>
          <Box sx={{ my: 1, mx: 'auto' }}>
            <Stack direction="row" spacing={3}>
              <Button variant="contained" onClick={closeSession}>
                Close attendance session
              </Button>
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
          <Typography
            variant="p"
            sx={{
              mx: 'auto',
              mb: 0,
              mt: 'auto',
              p: 2,
              backgroundColor: lastUpdateColor(lastUpdate),
            }}
          >
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

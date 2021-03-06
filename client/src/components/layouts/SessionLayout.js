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
import useMediaQuery from '@mui/material/useMediaQuery';
import Numpad from '../SessionTools/Numpad';
import SessionStudentList from '../SessionTools/SessionStudentList';
import Loading from '../Loading/Loading';
import bySignIn from '../../helperFunctions/listSorters/bySignIn';
import byName from '../../helperFunctions/listSorters/byName';

function SessionLayout() {
  const [sessionStatus, setSessionStatus] = useState('uninitialized');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [clock, setClock] = useState(new Date().toLocaleTimeString());
  const { id } = useParams();
  const {
    init,
    lastUpdate,
    studentStatus,
    sessionData,
    closeSession,
    setOnCloseCallback,
  } = useContext(SocketStore);

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
    return () => setSessionStatus('closed');
  }, []);

  useEffect(() => {
    if (sessionStatus === 'uninitialized') {
      init(id);
      setSessionStatus('initialized');
    }
  }, [init, id, sessionStatus]);

  useEffect(() => {
    if (sessionData && sessionStatus === 'initialized') {
      function onCloseCallback() {
        history.push(`/sessionrecap/${sessionData.id}`);
      }

      setOnCloseCallback(onCloseCallback);
      setSessionStatus('connected');
    }
  }, [sessionStatus, sessionData, history, setOnCloseCallback]);

  useEffect(() => {
    function toggleFullscreenState() {
      if (document.fullscreenElement) {
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
      }
    }
    document.addEventListener('fullscreenchange', toggleFullscreenState);

    return () => {
      document.removeEventListener('fullscreenchange', toggleFullscreenState);
    };
  }, []);

  function toggleFullscreen() {
    const element = document.querySelector('.fullscreen');
    if (document.fullscreenElement) {
      return document.exitFullscreen();
    }
    return element.requestFullscreen();
  }

  function handleClickClose() {
    setSessionStatus('closing');
    closeSession();
  }

  return sessionStatus === 'connected' ? (
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
          maxHeight: '20%',
          alignItems: 'center',
          mx: 3,
          position: 'relative',
        }}
      >
        <Link style={{ position: 'absolute' }} to="/dashboard">
          <Typography variant="p">&lt; Back to classes</Typography>
        </Link>
        <Box sx={{ display: 'block', textAlign: 'center', m: 'auto' }}>
          <h1>{sessionData.className}</h1>
          <h2>{new Date().toLocaleDateString()}</h2>
          <h3>{clock}</h3>
        </Box>
        <Link to="#">
          <Typography variant="p">{/* Settings */}</Typography>
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
            <Button variant="contained" onClick={handleClickClose}>
              Close attendance session
            </Button>
          </Box>
        </Box>
        <Paper
          sx={{
            my: 'auto',
            mx: matches ? 'auto' : 6,
            px: 6,
            pt: 2,
            pb: 4,
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
    <Loading />
  );
}

export default SessionLayout;

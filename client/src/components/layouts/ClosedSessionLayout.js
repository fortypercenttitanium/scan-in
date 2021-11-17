import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

function ClosedSessionLayout() {
  const [sessionData, setSessionData] = useState({});
  console.log(sessionData);

  const { id } = useParams();

  useEffect(() => {
    async function getSessionData() {
      const request = await fetch(`/db/session/${id}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await request.json();
      setSessionData(data);
    }

    getSessionData();
  }, [id]);

  const matches = useMediaQuery('(max-width:768px)');

  return (
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
        <Box sx={{ display: 'block', textAlign: 'center' }}>
          {/* <h1>{sessionData.className}</h1>
          <h2>{new Date().toLocaleDateString()}</h2>
          <h3>{sessionData.startTime}</h3> */}
        </Box>
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
            {/* <p>
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
            </p> */}
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            {/* <h3>Sign-in deadline: 10:30am</h3> */}
          </Box>
          {/* <SessionStudentList
            data={bySignIn(byName(studentStatus, 'last'), 'present')}
          /> */}
          <Box sx={{ textAlign: 'center' }}>
            {/* <p>Sign in expires: 12:30pm</p>
            <p>Change expiration time in settings</p> */}
          </Box>
          <Box sx={{ my: 1, mx: 'auto' }}>
            <Button variant="contained">Export to csv</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ClosedSessionLayout;

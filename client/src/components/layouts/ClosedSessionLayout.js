import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import grey from '@mui/material/colors/grey';
import green from '@mui/material/colors/green';
import red from '@mui/material/colors/red';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SessionStudentList from '../SessionTools/SessionStudentList';
import Loading from '../Loading/Loading';
import bySignIn from '../../helperFunctions/listSorters/bySignIn';
// import byName from '../../helperFunctions/listSorters/byName';
import convertLogToStudentStatus from '../../helperFunctions/convertLogToStudentStatus';
import studentStatusToCsv from '../../helperFunctions/studentStatusToCsv';
import format from 'date-fns/format';

function ClosedSessionLayout() {
  const [sessionData, setSessionData] = useState();
  const [studentData, setStudentData] = useState([]);
  const [downloadToken, setDownloadToken] = useState('');

  const history = useHistory();

  const API_ENDPOINT =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000/download'
      : '/download';

  const { id } = useParams();

  useEffect(() => {
    async function getSessionData() {
      const request = await fetch(`/db/sessionrecap/${id}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await request.json();

      if (data) {
        setSessionData(data);
        setStudentData(bySignIn(convertLogToStudentStatus(data)));
      } else {
        history.push('/dashboard');
      }
    }

    getSessionData();
  }, [id, history]);

  async function requestDownloadLink() {
    try {
      const data = studentStatusToCsv(studentData);

      const response = await fetch('/db/sessionDownload', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ data }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const token = await response.json();

        setDownloadToken(token);
      }
    } catch (err) {
      console.error(err);
    }
  }

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
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {sessionData ? (
        <>
          <Box
            sx={{
              display: 'flex',
              position: 'relative',
              maxHeight: '20%',
              alignItems: 'center',
              mx: 3,
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                textAlign: 'center',
                m: 'auto',
                ml: 3,
                position: 'absolute',
              }}
            >
              <Link to="/dashboard">
                <Typography variant="p">&lt; Back to classes</Typography>
              </Link>
            </Box>
            <Box sx={{ display: 'block', textAlign: 'center', m: 'auto' }}>
              <h1>{sessionData.className}</h1>
              <h3>
                Opened:{' '}
                {format(new Date(Number(sessionData.startTime)), 'PPpp')}
              </h3>
              <h3>
                Closed : {format(new Date(Number(sessionData.endTime)), 'PPpp')}
              </h3>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: '4px',
              maxHeight: '80%',
              width: 'clamp(800px, 80vw, 1200px)',
            }}
          >
            <Box
              sx={{
                display: 'grid',
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
                <Typography variant="p" sx={{ color: green[800] }}>
                  Present:{' '}
                  {
                    studentData.filter(
                      (student) => student.status === 'present',
                    ).length
                  }
                </Typography>
                <Typography variant="p" sx={{ color: red[800] }}>
                  Absent:{' '}
                  {
                    studentData.filter((student) => student.status === 'absent')
                      .length
                  }
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                {/* <h3>Sign-in deadline: 10:30am</h3> */}
              </Box>
              <SessionStudentList data={studentData} />
              <Box sx={{ textAlign: 'center' }}>
                {/* <p>Sign in expires: 12:30pm</p>
            <p>Change expiration time in settings</p> */}
              </Box>
              <Box
                sx={{
                  my: 1,
                  mx: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Button variant="contained" onClick={requestDownloadLink}>
                  Export to csv
                </Button>
                <a
                  style={{ margin: '8px auto' }}
                  href={`${API_ENDPOINT}/${downloadToken}`}
                  download="session_recap.csv"
                >
                  {downloadToken && 'Download'}
                </a>
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        <Loading />
      )}
    </Box>
  );
}

export default ClosedSessionLayout;

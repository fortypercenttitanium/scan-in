import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import grey from '@mui/material/colors/grey';

function SessionList() {
  const [sessions, setSessions] = useState([]);
  const [dataIsStale, setDataIsStale] = useState(true);

  useEffect(() => {
    async function getClasses() {
      try {
        const response = await fetch('/db/sessions', {
          credentials: 'include',
          method: 'GET',
        });
        if (response.ok) {
          const json = await response.json();
          setSessions(json);
          setDataIsStale(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (dataIsStale) {
      getClasses();
    }
  }, [setSessions, dataIsStale]);

  return (
    // TODO change to table
    <Box
      sx={{
        display: 'grid',
        width: '100%',
        gap: '8px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gridTemplateRows: 'repeat(auto-fit, minmax(200px, 1fr))',
        maxHeight: '100%',
        overflow: 'auto',
      }}
    >
      {sessions.map((session) => (
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            background: grey[300],
            border: 'none',
            cursor: 'pointer',
            '&:hover': {
              background: grey[200],
            },
          }}
          component="button"
          key={session.id}
        >
          <h1>{session.className}</h1>
          <h2>{new Date(Number(session.startTime)).toLocaleDateString()}</h2>
          <h3>{new Date(Number(session.startTime)).toLocaleTimeString()}</h3>
        </Paper>
      ))}
    </Box>
  );
}

export default SessionList;

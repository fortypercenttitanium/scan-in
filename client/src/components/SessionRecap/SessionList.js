import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import SessionsTable from './SessionsTable';
import Loading from '../Loading/Loading';

function SessionList({ onSessionClick: handleSessionClick }) {
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
      {dataIsStale ? (
        <Loading />
      ) : (
        <SessionsTable
          handleSessionClick={handleSessionClick}
          sessionsData={sessions}
        />
      )}
    </Box>
  );
}

export default SessionList;

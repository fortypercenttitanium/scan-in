import React from 'react';
import Box from '@mui/material/Box';
import SessionsTable from './SessionsTable';
import Loading from '../Loading/Loading';

function SessionList({
  onSessionClick: handleSessionClick,
  sessions,
  loading,
}) {
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
      {loading ? (
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

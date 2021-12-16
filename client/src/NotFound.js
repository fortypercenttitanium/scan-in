import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';

function NotFound() {
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      history.push('/');
    }, 3000);
  }, [history]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        height: '200px',
        '& > *': {
          margin: 'auto',
        },
      }}
    >
      <h1>Not Found</h1>
      <p>Oops, we couldn't find that page. Redirecting you home...</p>
    </Box>
  );
}

export default NotFound;

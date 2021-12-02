import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { Store } from '../../store/Provider';

const authURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/auth/microsoft'
    : '/auth/microsoft';

function Nav() {
  const { userData } = useContext(Store);
  return (
    <Box sx={{ display: 'flex', my: 'auto', ml: 'auto', mr: '48px' }}>
      <Box>
        {userData ? (
          <Typography variant="h4">Hi, {userData.firstName}</Typography>
        ) : (
          <a href={authURL}>
            <Typography variant="h4">Login</Typography>
          </a>
        )}
      </Box>
    </Box>
  );
}

export default Nav;

import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { UserStore } from '../../store/UserProvider';

const authURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/auth/microsoft'
    : '/auth/microsoft';

const logoutURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/auth/logout'
    : '/auth/logout';

function Nav() {
  const { userData } = useContext(UserStore);

  async function handleLogout() {
    await fetch(logoutURL, {
      method: 'POST',
      credentials: 'include',
    });
  }

  return (
    <Box sx={{ display: 'flex', my: 'auto', ml: 'auto', mr: '24px' }}>
      <Box>
        {userData ? (
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              '& > *': {
                margin: 'auto',
                px: 2,
              },
            }}
          >
            <Typography variant="h5">Hi, {userData.firstName}</Typography>
            <a href="/" title="logout" onClick={handleLogout}>
              <Typography variant="h5">Logout</Typography>
            </a>
          </Box>
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

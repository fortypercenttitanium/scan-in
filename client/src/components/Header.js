import React from 'react';
import { Box, Typography } from '@mui/material';
import Nav from './Nav';

function Header() {
  return (
    <Box sx={{ display: 'flex' }}>
      <a href="/">
        <Typography
          variant="h1"
          fontSize="4rem"
          fontFamily="StarJedi"
          ml={4}
          color="#222"
        >
          Scan-in
        </Typography>
      </a>
      <Nav />
    </Box>
  );
}

export default Header;

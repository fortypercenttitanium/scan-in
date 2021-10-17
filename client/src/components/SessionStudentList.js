import React from 'react';
import Box from '@mui/material/Box';

function SessionStudentList({ data }) {
  console.log(data);
  return (
    <Box sx={{ gridColumnEnd: 'span 2', border: '1px solid blue', m: 1 }}>
      Student list
    </Box>
  );
}

export default SessionStudentList;

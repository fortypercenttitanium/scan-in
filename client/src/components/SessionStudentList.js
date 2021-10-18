import React from 'react';
import Box from '@mui/material/Box';

function SessionStudentList({ data }) {
  return (
    <Box
      sx={{
        gridColumnEnd: 'span 2',
        border: '1px solid blue',
        m: 1,
        overflow: 'auto',
      }}
    >
      {data.map((studentData) => (
        <p key={studentData.id}>
          {studentData.firstName} {studentData.lastName} - {studentData.status}{' '}
          {studentData.timeStamp &&
            new Date(studentData.timeStamp).toLocaleTimeString()}
        </p>
      ))}
    </Box>
  );
}

export default SessionStudentList;

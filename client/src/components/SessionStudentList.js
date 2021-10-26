import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function SessionStudentList({ data }) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        gridColumnEnd: 'span 2',
        p: 2,
        m: 1,
        overflow: 'auto',
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow
            sx={{
              '& .MuiTableCell-head': { fontWeight: 'bold', fontSize: 'large' },
            }}
          >
            <TableCell>Student</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Sign-in time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((studentData) => (
            <TableRow key={studentData.id}>
              <TableCell>
                {studentData.firstName} {studentData.lastName}
              </TableCell>
              <TableCell>{studentData.status}</TableCell>
              <TableCell>
                {studentData.signInTime &&
                  new Date(Number(studentData.signInTime)).toLocaleTimeString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SessionStudentList;

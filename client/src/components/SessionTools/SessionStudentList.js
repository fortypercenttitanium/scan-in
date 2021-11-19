import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { green, grey } from '@mui/material/colors';

function SessionStudentList({ data }) {
  function statusBackgroundColor(status) {
    switch (status) {
      case 'present':
        return green[100];
      case 'absent':
        return grey[200];
      default:
        return 'inherit';
    }
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        gridColumnEnd: 'span 2',
        p: 2,
        m: 1,
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
            <TableRow
              key={studentData.id}
              sx={{
                backgroundColor: statusBackgroundColor(studentData.status),
              }}
            >
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

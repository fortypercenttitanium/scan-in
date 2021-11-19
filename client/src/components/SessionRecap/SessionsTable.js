import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SessionTableBody from './SessionTableBody';
import sessionByMostRecent from '../../helperFunctions/listSorters/sessionByMostRecent';

const Headers = () => (
  <TableHead>
    <TableRow
      sx={{
        '& > .MuiTableCell-head': { fontWeight: 'bold', fontSize: '1.2rem' },
      }}
    >
      <TableCell>Class</TableCell>
      <TableCell align="right">Date</TableCell>
      <TableCell align="right">Start time</TableCell>
    </TableRow>
  </TableHead>
);

function SessionsTable({ sessionsData, handleSessionClick }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const newData = sessionsData.map((sessionData) => {
      const { id, className } = sessionData;
      const startTimeNumber = Number(sessionData.startTime);
      const rawDate = new Date(startTimeNumber);

      const startTime = rawDate.toLocaleTimeString();
      const date = rawDate.toLocaleDateString();

      return {
        id,
        className,
        startTime,
        date,
      };
    });

    const sortedData = sessionByMostRecent(newData);

    setData(sortedData);
  }, [sessionsData]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <Headers />
        <TableBody>
          <SessionTableBody
            dataArr={data}
            handleSessionClick={handleSessionClick}
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SessionsTable;

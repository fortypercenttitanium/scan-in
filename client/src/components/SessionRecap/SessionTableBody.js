import React, { useState, useEffect } from 'react';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableRow from '@mui/material/TableRow';

const SessionTableBody = ({ dataArr, handleSessionClick }) => {
  const [focusElement, setFocusElement] = useState('');

  useEffect(() => {
    function handleKeyPress(e) {
      if (e.key === 'Enter') {
        handleEnter();
      }
    }

    document.addEventListener('keypress', handleKeyPress);

    return () => document.removeEventListener('keypress', handleKeyPress);
  });

  function handleFocus(id) {
    setFocusElement(id);
  }

  function handleEnter() {
    if (focusElement) {
      handleSessionClick(focusElement);
    }
  }

  return dataArr.map((data) => (
    <TableRow
      sx={{
        ':hover,:focus': {
          background: 'rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
        },
      }}
      key={data.id}
      tabIndex="0"
      onClick={() => handleSessionClick(data.id)}
      onFocus={() => handleFocus(data.id)}
    >
      <TableCell>
        <Typography variant="p">{data.className}</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="p">{data.date}</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="p">{data.startTime}</Typography>
      </TableCell>
    </TableRow>
  ));
};

export default SessionTableBody;

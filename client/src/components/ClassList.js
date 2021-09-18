import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import styled from 'styled-components';

const ClassContainer = styled.div`
  display: flex;
  width: 600px;
  margin: auto;
`;

function ClassList() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState();

  useEffect(() => {
    async function getClasses() {
      try {
        const response = await fetch('/db/classes', {
          credentials: 'include',
          method: 'GET',
        });
        if (response.ok) {
          const json = await response.json();
          setClasses(json);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getClasses();
  }, [setClasses]);

  function handleClickSelect(id) {
    setSelectedClass(id);
  }

  return (
    <Box m={'24px auto'} sx={{ minWidth: 240, maxWidth: 400 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Class</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Class"
          value={selectedClass}
          onChange={handleClickSelect}
        >
          {classes.map((classObj) => (
            <MenuItem value={classObj.id}>{classObj.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default ClassList;

import React, { useEffect, useState } from 'react';
import {
  InputLabel,
  MenuItem,
  Select,
  Box,
  FormControl,
  Button,
} from '@mui/material';

function ClassList({ onSubmit: startSession }) {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

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

  function handleClickSelect(e) {
    setSelectedClass(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    startSession(selectedClass);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box
        m={'24px auto'}
        sx={{ minWidth: 240, maxWidth: 400, '& button': { m: 1 } }}
      >
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Class</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Class"
            value={selectedClass}
            onChange={handleClickSelect}
            required
          >
            {classes.map((classObj) => (
              <MenuItem key={classObj.id} value={classObj.id}>
                {classObj.name}
              </MenuItem>
            ))}
          </Select>
          <Button variant="contained" type="submit">
            Start session
          </Button>
        </FormControl>
      </Box>
    </form>
  );
}

export default ClassList;

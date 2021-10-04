import React, { useEffect, useState } from 'react';
import {
  InputLabel,
  MenuItem,
  Select,
  Box,
  FormControl,
  Button,
  Stack,
} from '@mui/material';
import { useHistory } from 'react-router-dom';

function ClassList({ onSubmit: startSession }) {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  let history = useHistory();

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
    history.push(`/session/${selectedClass}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box
        m={'24px auto'}
        minWidth={240}
        maxWidth={800}
        justifyContent="center"
        display="flex"
      >
        <FormControl>
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
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            m="24px auto"
          >
            <Button variant="outlined" type="button">
              Add class
            </Button>
            <Button variant="outlined" type="button">
              Edit class
            </Button>
          </Stack>
          <Button variant="contained" type="submit" size="large">
            Take attendance
          </Button>
        </FormControl>
      </Box>
    </form>
  );
}

export default ClassList;

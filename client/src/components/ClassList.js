import React, { useEffect, useState } from 'react';
import {
  InputLabel,
  MenuItem,
  Select,
  Box,
  FormControl,
  Button,
  Stack,
  Dialog,
} from '@mui/material';
import AddClass from './AddClass';
import EditClass from './EditClass';

function ClassList({ onSubmit: startSession }) {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [dialogOpen, setDialogOpen] = useState('');
  const [dataIsStale, setDataIsStale] = useState(true);

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
          setDataIsStale(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (dataIsStale) {
      getClasses();
    }
  }, [setClasses, dataIsStale]);

  function handleClickSelect(e) {
    setSelectedClass(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    startSession(selectedClass);
  }

  async function handleDelete(e) {
    e.preventDefault();

    await fetch('/db/class', {
      method: 'DELETE',
      credentials: 'include',
      body: JSON.stringify({ classData: selectedClass }),
      headers: {
        'Content-type': 'application/json',
      },
    });

    setSelectedClass('');
    setDataIsStale(true);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Dialog open={dialogOpen === 'add'} onClose={() => setDialogOpen('')}>
        <AddClass
          setDialogOpen={setDialogOpen}
          setDataIsStale={setDataIsStale}
        />
      </Dialog>
      <Dialog open={dialogOpen === 'edit'} onClose={() => setDialogOpen('')}>
        <EditClass
          selectedClass={classes.find(
            (classObj) => classObj.id === selectedClass,
          )}
          setDialogOpen={setDialogOpen}
          setDataIsStale={setDataIsStale}
        />
      </Dialog>
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
            <Button
              onClick={() => setDialogOpen('add')}
              variant="outlined"
              type="button"
            >
              Add class
            </Button>
            <Button
              onClick={() => setDialogOpen('edit')}
              variant="outlined"
              type="button"
              disabled={!selectedClass}
            >
              Edit class
            </Button>
            <Button
              onClick={handleDelete}
              variant="outlined"
              type="button"
              disabled={!selectedClass}
            >
              Delete class
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

import React, { useState } from 'react';
import {
  InputLabel,
  MenuItem,
  Select,
  Box,
  FormControl,
  Button,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import AddClass from './AddClass';
import EditClass from './EditClass';
import Loading from '../Loading/Loading';

function ClassList({
  onSubmit: startSession,
  classes,
  openSession,
  requestHydrate,
  loading,
}) {
  const [selectedClass, setSelectedClass] = useState('');
  const [dialogOpen, setDialogOpen] = useState('');

  function handleClickSelect(e) {
    setSelectedClass(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const classSession = openSession.classID || selectedClass;
    startSession(classSession);
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
    setDialogOpen('');
    requestHydrate('classes');
  }

  return (
    <form onSubmit={handleSubmit}>
      <Dialog open={dialogOpen === 'add'} onClose={() => setDialogOpen('')}>
        <AddClass
          setDialogOpen={setDialogOpen}
          requestHydrate={requestHydrate}
        />
      </Dialog>
      <Dialog open={dialogOpen === 'edit'} onClose={() => setDialogOpen('')}>
        <EditClass
          selectedClass={classes.find(
            (classObj) => classObj.id === selectedClass,
          )}
          setDialogOpen={setDialogOpen}
          requestHydrate={requestHydrate}
        />
      </Dialog>
      <Dialog
        open={dialogOpen === 'delete'}
        onClose={() => setDialogOpen('')}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete class?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this class?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen('delete')} autoFocus>
            Cancel
          </Button>
          <Button onClick={handleDelete}>DELETE</Button>
        </DialogActions>
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
            required={!openSession}
          >
            {loading ? (
              <Loading />
            ) : (
              classes.map((classObj) => (
                <MenuItem key={classObj.id} value={classObj.id}>
                  {classObj.name}
                </MenuItem>
              ))
            )}
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
              onClick={() => setDialogOpen('delete')}
              variant="outlined"
              type="button"
              disabled={!selectedClass}
            >
              Delete class
            </Button>
          </Stack>
          <Button
            disabled={loading}
            variant="contained"
            type="submit"
            size="large"
            title={'Open attendance session'}
          >
            {openSession.className
              ? `Resume ${openSession.className} attendance session`
              : 'Take attendance'}
          </Button>
        </FormControl>
      </Box>
    </form>
  );
}

export default ClassList;

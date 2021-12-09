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
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import JsonFetcher from '../../helperFunctions/fetchers/JsonFetcher';
import AddClass from './AddClass';
import EditClass from './EditClass';
import Loading from '../Loading/Loading';

const fetcher = new JsonFetcher();

function ClassList({ onSubmit: startSession }) {
  const [classes, setClasses] = useState([]);
  const [openSession, setOpenSession] = useState({});
  const [selectedClass, setSelectedClass] = useState('');
  const [dialogOpen, setDialogOpen] = useState('');
  const [dataShouldHydrate, setDataShouldHydrate] = useState([
    'classes',
    'openSessions',
  ]);

  useEffect(() => {
    async function getClasses() {
      try {
        const data = await fetcher.fetch('/db/classes');

        if (data) {
          setClasses(data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    async function getOpenSessions() {
      try {
        const data = await fetcher.fetch('/db/openSessions');
        if (data && data.length) {
          setOpenSession(data[0]);
        } else {
          setOpenSession('');
        }
      } catch (err) {
        console.log(err);
      }
    }

    async function hydrateData() {
      if (dataShouldHydrate.length) {
        const classesShouldHydrate = dataShouldHydrate.filter(
          (item) => item === 'classes',
        ).length;
        const openSessionsShouldHydrate = dataShouldHydrate.filter(
          (item) => item === 'openSessions',
        ).length;

        const dataDidHydrate = [];

        if (classesShouldHydrate) {
          await getClasses();
          dataDidHydrate.push('classes');
        }

        if (openSessionsShouldHydrate) {
          await getOpenSessions();
          dataDidHydrate.push('openSessions');
        }

        setDataShouldHydrate(
          dataShouldHydrate.filter((item) => !dataDidHydrate.includes(item)),
        );
      }
    }

    hydrateData();
  }, [setClasses, dataShouldHydrate]);

  function handleClickSelect(e) {
    setSelectedClass(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const classSession = openSession.classID || selectedClass;
    startSession(classSession);
  }

  function hydrateData(type) {
    setDataShouldHydrate([...dataShouldHydrate, type]);
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
    setDataShouldHydrate([...dataShouldHydrate, 'classes']);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Dialog open={dialogOpen === 'add'} onClose={() => setDialogOpen('')}>
        <AddClass setDialogOpen={setDialogOpen} hydrateData={hydrateData} />
      </Dialog>
      <Dialog open={dialogOpen === 'edit'} onClose={() => setDialogOpen('')}>
        <EditClass
          selectedClass={classes.find(
            (classObj) => classObj.id === selectedClass,
          )}
          setDialogOpen={setDialogOpen}
          hydrateData={hydrateData}
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
            {dataShouldHydrate.length ? (
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
            disabled={!!dataShouldHydrate.length}
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

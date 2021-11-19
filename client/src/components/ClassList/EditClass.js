import React, { useState, useEffect } from 'react';
import {
  TextField,
  FormControl,
  Box,
  Button,
  FormHelperText,
  CircularProgress,
  Stack,
} from '@mui/material';
import parseStudentData from '../../helperFunctions/parseStudentData';
import formatStudentList from '../../helperFunctions/formatStudentList';

function EditClass({ setDialogOpen, selectedClass, setDataIsStale }) {
  const [className, setClassName] = useState(selectedClass.name || '');
  const [studentData, setStudentData] = useState('');
  const [loading, setLoading] = useState(true);
  const [disableButton, setDisableButton] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const studentDataFormat = 'Last, First (ID)';

  useEffect(() => {
    async function fetchStudents() {
      const students = await fetch('/db/studentIDs', {
        method: 'POST',
        body: JSON.stringify({ students: selectedClass.students }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await students.json();

      const studentDataString = result
        .map((student) => {
          return `${student.lastName}, ${student.firstName} (${student.id})`;
        })
        .join('\n');
      setStudentData(studentDataString);
      setLoading(false);
    }

    // don't fetch if button is disabled - this means the data is still updating
    if (!disableButton) {
      fetchStudents();
    }
  }, [selectedClass.students, disableButton]);

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setDisableButton(true);
      setError('');
      setMessage('Editing students...');

      // trim text box and reset
      const classNameTrimmed = className.trim();
      setClassName(classNameTrimmed);

      // convert to array at newlines
      const studentDataFormatted = studentData
        .split('\n')
        .map((data) => data.trim());
      const parsedStudentData = studentDataFormatted.map((data) =>
        parseStudentData(data),
      );

      // validate data
      const hasStudentError = !parsedStudentData.every((data) => data);
      const hasClassNameError = !classNameTrimmed;

      if (hasStudentError) {
        return parsedStudentData.forEach((data, index) => {
          if (!data) {
            setMessage('');
            setDisableButton(false);
            setError(
              `Invalid student entry on line ${index + 1}
              Please use the format: ${studentDataFormat}`,
            );
          }
        });
      }

      if (hasClassNameError) {
        setMessage('');
        setDisableButton(false);
        return setError('Invalid class name');
      }

      const studentsResult = await fetch('/db/students', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          students: parsedStudentData,
          classID: selectedClass.id,
        }),
      });

      if (studentsResult.ok) {
        setMessage('Edited students, now editing class...');
        const classResult = await fetch('/db/class', {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            classData: {
              name: classNameTrimmed,
              students: parsedStudentData,
              id: selectedClass.id,
            },
          }),
        });

        if (classResult.ok) {
          const json = JSON.parse(await classResult.json());

          if (json.error) {
            setMessage('');
            return setError(json.error);
          }
          setClassName('');
          setStudentData('');
          setMessage('Class edited successfully');
          setDataIsStale(true);

          return setTimeout(() => setDialogOpen(''), 1000);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleNameChange(e) {
    setClassName(e.target.value);
  }

  function handleStudentChange(e) {
    setStudentData(e.target.value);
  }

  return (
    <Box
      component="div"
      sx={{
        '& .MuiTextField-root': {
          m: 1,
        },
        m: 'auto',
        p: '36px',
        minWidth: '600px',
        textAlign: 'center',
      }}
    >
      <h1>Edit class</h1>
      {loading ? (
        <CircularProgress />
      ) : (
        <FormControl fullWidth>
          <TextField
            id="outlined-basic"
            label="Class Name"
            variant="outlined"
            value={className}
            onChange={handleNameChange}
            required
          />
          <TextField
            id="outlined-multiline-static"
            label="Enter students in the class, each on a new line:"
            multiline
            rows={10}
            value={studentData}
            placeholder="Smith, John (123456)"
            onChange={handleStudentChange}
          />
          {error && <FormHelperText error>{error}</FormHelperText>}
          {message && (
            <FormHelperText sx={{ color: 'green' }}>{message}</FormHelperText>
          )}
          <Stack direction="row" spacing={2}>
            <Button
              onClick={() => setStudentData(formatStudentList(studentData))}
              variant="contained"
              size="medium"
              sx={{ m: 'auto' }}
              type="button"
              disabled={!studentData || disableButton}
            >
              Format list
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="success"
              size="medium"
              sx={{ m: 'auto' }}
              type="button"
              disabled={loading || disableButton}
            >
              Update class
            </Button>
          </Stack>
        </FormControl>
      )}
    </Box>
  );
}

export default EditClass;

import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  Box,
  Button,
  FormHelperText,
  Stack,
} from '@mui/material';
import parseStudentData from '../../helperFunctions/parseStudentData';
import formatStudentList from '../../helperFunctions/formatStudentList';

function AddClass({ setDialogOpen, requestHydrate }) {
  const [className, setClassName] = useState('');
  const [studentData, setStudentData] = useState('');
  const [error, setError] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [message, setMessage] = useState('');
  const studentDataFormat = 'Last, First (ID)';

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setDisableButton(true);
      setError('');
      setMessage('Adding students...');

      // trim text box and reset
      const classNameTrimmed = className.trim();
      setClassName(classNameTrimmed);

      // convert to array at newlines and trim whitespace
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
            setError(
              `Invalid student entry on line ${index + 1}
              Please use the format: ${studentDataFormat}`,
            );
            setDisableButton(false);
          }
        });
      }

      if (hasClassNameError) {
        setMessage('');
        setDisableButton(false);
        return setError('Invalid class name');
      }

      const studentsResult = await fetch('/db/students', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ students: parsedStudentData }),
      });

      if (studentsResult.ok) {
        setMessage('Added students, now adding class...');
        const classResult = await fetch('/db/class', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            classData: { name: classNameTrimmed, students: parsedStudentData },
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
          setMessage('Class added successfully');
          requestHydrate('classes');

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
      <h1>Add class</h1>
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
        <Stack direction="row" spacking={2}>
          <Button
            onClick={() => setStudentData(formatStudentList(studentData))}
            variant="contained"
            size="medium"
            sx={{ m: 'auto' }}
            type="button"
            disabled={!studentData || disableButton}
            title="Format data pasted from OnCourse Class Roster PDF"
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
            disabled={disableButton}
          >
            Submit
          </Button>
        </Stack>
      </FormControl>
    </Box>
  );
}

export default AddClass;

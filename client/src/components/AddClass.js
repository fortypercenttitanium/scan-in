import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  Box,
  Button,
  FormHelperText,
} from '@mui/material';

function AddClass({ setDialogOpen, setDataIsStale }) {
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
      const studentDataTrimmed = studentData.trim();
      const classNameTrimmed = className.trim();
      setStudentData(studentDataTrimmed);
      setClassName(classNameTrimmed);

      // convert to array at newlines
      const split = studentDataTrimmed.split('\n');
      const parsedStudentData = split.map((data) => parseStudentData(data));

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

  function parseStudentData(data) {
    // TODO: adjust to account for two-word names, or inclusion of middle name
    const regex = /^[A-Za-z']+, [A-Za-z\-']+ \(\d{5,}\)$/;

    if (!regex.test(data)) {
      return null;
    }

    const split = data.split(' ');
    const firstName = split[1];
    const lastName = split[0].replace(',', '');
    const id = split[2].replace(/\(|\)/g, '');

    return {
      firstName,
      lastName,
      id,
    };
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
      </FormControl>
    </Box>
  );
}

export default AddClass;

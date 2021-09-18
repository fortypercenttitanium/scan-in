import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  Box,
  Button,
  FormHelperText,
} from '@mui/material';

function AddOrEditClass() {
  const [className, setClassName] = useState('');
  const [studentData, setStudentData] = useState('');
  const [error, setError] = useState('');
  const studentDataFormat = 'Last, First (ID)';

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setError('');

      // trim text box and reset
      const trimmed = studentData.trim();
      setStudentData(trimmed);

      // convert to array at newlines
      const split = trimmed.split('\n');
      const parsedData = split.map((data) => parseStudentData(data));

      // validate each student
      const hasErrors = !parsedData.every((data) => data);
      if (hasErrors) {
        return parsedData.forEach((data, index) => {
          if (!data)
            setError(
              `Invalid student entry on line ${index + 1}
              Please use the format: ${studentDataFormat}`,
            );
        });
      }

      const studentsResult = await fetch('/db/students', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ students: parsedData }),
      });
      console.log(studentsResult);
      if (studentsResult.ok) {
        const studentsJSON = await studentsResult.json();
        console.log('Successfully added students: \n', studentsJSON);
      } else {
        console.log(studentsResult);
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
    const firstName = split[1].replace(',', '');
    const lastName = split[0];
    const id = split[2].replace(/\(|\)/g, '');

    return {
      firstName,
      lastName,
      id,
    };
  }

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': {
          m: 1,
        },
        m: 'auto',
        minWidth: '600px',
      }}
      noValidate
      onSubmit={handleSubmit}
    >
      <FormControl fullWidth>
        <TextField
          id="outlined-basic"
          label="Class Name"
          variant="outlined"
          value={className}
          onChange={handleNameChange}
        />
        <TextField
          id="outlined-multiline-static"
          label="Students"
          multiline
          rows={10}
          value={studentData}
          placeholder={studentDataFormat}
          onChange={handleStudentChange}
        />
        {error && <FormHelperText error>{error}</FormHelperText>}
        <Button
          variant="contained"
          color="success"
          size="medium"
          sx={{ m: 'auto' }}
          type="submit"
        >
          Submit
        </Button>
      </FormControl>
    </Box>
  );
}

export default AddOrEditClass;

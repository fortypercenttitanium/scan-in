import React, { useState } from 'react';
import { Paper, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const Item = styled(Button)(({ theme }) => ({
  ...theme.typography.body2,
  height: theme.spacing(10),
  fontSize: '1rem',
  width: theme.spacing(10),
  textAlign: 'center',
}));

function Numpad() {
  const [numpadDisplay, setNumpadDisplay] = useState('');

  function handleNumberPress(e) {
    setNumpadDisplay(numpadDisplay + e.target.dataset.value);
  }

  function handleBackPress() {
    setNumpadDisplay(numpadDisplay.slice(0, -1));
  }

  function handleSubmit() {
    console.log('submitting ' + Number(numpadDisplay));
    handleClear();
  }

  function handleClear() {
    setNumpadDisplay('');
  }

  function handleClick(e) {
    switch (e.target.dataset.type) {
      case 'number':
        handleNumberPress(e);
        break;
      case 'back':
        handleBackPress();
        break;
      case 'submit':
        handleSubmit();
        break;
      case 'clear':
        handleClear();
        break;
      default:
        break;
    }
  }
  return (
    <Paper
      variant="outlined"
      sx={{
        margin: '12px auto',
        p: '12px',
        backgroundColor: grey[300],
        boxShadow: '4px 4px 4px gray',
      }}
      onClick={handleClick}
    >
      <Paper
        sx={{
          height: '60px',
          padding: '12px',
          fontSize: '1.5rem',
          textAlign: 'center',
          alignItems: 'center',
        }}
      >
        {numpadDisplay}
      </Paper>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        margin="8px"
      >
        <Item data-type="number" data-value={1} variant="contained">
          1
        </Item>
        <Item data-type="number" data-value={2} variant="contained">
          2
        </Item>
        <Item data-type="number" data-value={3} variant="contained">
          3
        </Item>
      </Stack>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        margin="8px"
      >
        <Item data-type="number" data-value={4} variant="contained">
          4
        </Item>
        <Item data-type="number" data-value={5} variant="contained">
          5
        </Item>
        <Item data-type="number" data-value={6} variant="contained">
          6
        </Item>
      </Stack>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        margin="8px"
      >
        <Item data-type="number" data-value={7} variant="contained">
          7
        </Item>
        <Item data-type="number" data-value={8} variant="contained">
          8
        </Item>
        <Item data-type="number" data-value={9} variant="contained">
          9
        </Item>
      </Stack>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        margin="8px"
      >
        <Item data-type="back" variant="contained">
          {'<'}
        </Item>
        <Item data-type="number" data-value={0} variant="contained">
          0
        </Item>
        <Item data-type="submit" data-value={1} variant="contained">
          Enter
        </Item>
      </Stack>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        margin="8px"
      >
        <Button
          size="large"
          sx={{ width: '100%', p: '24px' }}
          data-type="clear"
          variant="contained"
        >
          Clear
        </Button>
      </Stack>
    </Paper>
  );
}

export default Numpad;

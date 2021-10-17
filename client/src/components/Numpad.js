import React, { useState, useEffect, useContext } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { SocketStore } from '../store/SocketProvider';
import { Paper, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Fullscreen from '@mui/icons-material/Fullscreen';
import FullscreenExit from '@mui/icons-material/FullscreenExit';

const Item = styled(Button)(({ theme }) => ({
  ...theme.typography.body2,
  height: theme.spacing(7),
  fontSize: '1rem',
  width: theme.spacing(7),
  textAlign: 'center',
}));

function Numpad({ isFullscreen, toggleFullscreen }) {
  const [numpadDisplay, setNumpadDisplay] = useState('');
  const { scanIn } = useContext(SocketStore);

  function handleNumberPress(e) {
    setNumpadDisplay(numpadDisplay + e.target.dataset.value);
  }

  function handleBackPress() {
    setNumpadDisplay(numpadDisplay.slice(0, -1));
  }

  function handleScan(data) {
    handleSubmit(data);
  }

  function handleScanError(err) {
    console.error(err);
  }

  function handleSubmit(data) {
    if (data) {
      scanIn(data);
      return handleClear();
    }
    if (numpadDisplay) {
      scanIn(numpadDisplay);
      return handleClear();
    }
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
      case 'fullscreen':
        toggleFullscreen();
        break;
      default:
        break;
    }
  }
  return (
    <Paper
      variant="outlined"
      sx={{
        margin: '12px auto auto',
        p: '12px',
        backgroundColor: grey[300],
        boxShadow: '4px 4px 4px gray',
      }}
      onClick={handleClick}
    >
      <BarcodeReader onScan={handleScan} onError={handleScanError} />
      <Paper
        sx={{
          height: '42px',
          p: 1,
          mx: 1,
          fontSize: '1.2rem',
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
        spacing={1}
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
        spacing={1}
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
        spacing={1}
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
        spacing={1}
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
          sx={{ p: '14px', flex: 1 }}
          data-type="clear"
          variant="contained"
        >
          Clear
        </Button>
        <Item data-type="fullscreen" size="large" variant="contained">
          {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
        </Item>
      </Stack>
    </Paper>
  );
}

export default Numpad;

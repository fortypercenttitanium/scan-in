import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import QrReader from 'react-qr-barcode-scanner';
import beep from '../effects/beep.wav';

const StyledScanner = styled.div`
  display: flex;
  margin: 60px 48px auto auto;
  height: 500px;
  width: 800px;
  border: 1px solid black;
`;

function Scanner() {
  const [scannerTimeout, setScannerTimeout] = useState(false);
  const audioRef = useRef();

  useEffect(() => {
    if (scannerTimeout) {
      setTimeout(() => {
        setScannerTimeout(false);
      }, 3000);
    }
  }, [scannerTimeout]);

  const handleError = (err) => {
    console.log(err);
  };

  const handleScan = (err, data) => {
    console.log('checking');
    if (data) {
      setScannerTimeout(true);
      audioRef.current.play();
      console.log(data);
    }
  };
  return (
    <StyledScanner>
      {scannerTimeout ? null : (
        <QrReader delay={400} onError={handleError} onUpdate={handleScan} />
      )}
      <audio src={beep} ref={audioRef} />
    </StyledScanner>
  );
}

export default Scanner;

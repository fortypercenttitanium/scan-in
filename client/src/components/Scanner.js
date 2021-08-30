import React from 'react';
import styled from 'styled-components';
import QrReader from 'react-qr-scanner';

const StyledScanner = styled.div`
  display: flex;
  margin: 60px 48px auto auto;
  height: 500px;
  width: 800px;
  border: 1px solid black;
`;

const handleError = (err) => {
  console.log(err);
};

const handleScan = (data) => {
  if (data) {
    console.log(data);
  }
};

function Scanner() {
  return (
    <StyledScanner>
      <QrReader
        delay={100}
        style={{ height: 400, margin: 'auto' }}
        onError={handleError}
        onScan={handleScan}
      />
    </StyledScanner>
  );
}

export default Scanner;

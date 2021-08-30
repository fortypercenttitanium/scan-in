import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';
import QrReader from 'react-qr-barcode-scanner';
import beep from '../effects/beep.wav';
import { SocketStore } from '../store/SocketProvider';

const StyledScanner = styled.div`
  display: flex;
  margin: 60px 48px auto auto;
  height: 500px;
  width: 800px;
  border: 1px solid black;
`;

function Scanner() {
  const [userSignIn, setUserSignIn] = useState(null);
  const [loading, setLoading] = useState(false);
  const { sessionLog, sendMessage } = useContext(SocketStore);
  const audioRef = useRef();

  useEffect(() => {
    const newestSession = sessionLog.length && [sessionLog.length - 1];
    if (newestSession.event === 'SIGN_IN') {
      setLoading(false);
      setUserSignIn(newestSession.payload);
    }
  }, [sessionLog]);

  useEffect(() => {
    if (userSignIn && !loading) {
      setTimeout(() => {
        setUserSignIn(null);
      }, 2000);
    }
  }, [userSignIn, loading]);

  const handleError = (err) => {
    console.log(err);
  };

  const handleSignIn = (id) => {
    sendMessage({ event: 'SIGN_IN', payload: id });
  };

  const handleScan = (err, result) => {
    if (result) {
      setLoading(true);
      handleSignIn(result.text);
      audioRef.current.play();
    }
  };
  return (
    <StyledScanner>
      {loading ? (
        <h1>Please wait...</h1>
      ) : userSignIn ? (
        <h1>{`${userSignIn} signed in!`}</h1>
      ) : (
        <QrReader
          delay={200}
          onError={handleError}
          onUpdate={handleScan}
          facingMode="user"
        />
      )}
      <audio src={beep} ref={audioRef} />
    </StyledScanner>
  );
}

export default Scanner;

import React, { useState, useRef, useEffect, useContext } from 'react';
import Quagga from 'quagga';
import styled from 'styled-components';
import QrReader from 'react-qr-barcode-scanner';
import beep from '../effects/beep.wav';
import { SocketStore } from '../../store/SocketProvider';

const StyledScanner = styled.div`
  display: flex;
  margin: 60px 48px;
  border: 1px solid black;
`;

function Scanner() {
  const [userSignIn, setUserSignIn] = useState(null);
  const [loading, setLoading] = useState(false);
  const { sessionLog, sendMessage } = useContext(SocketStore);
  const audioRef = useRef();

  // useEffect(() => {
  //   const newestSession = sessionLog.length && [sessionLog.length - 1];
  //   if (newestSession.event === 'SIGN_IN') {
  //     setLoading(false);
  //     setUserSignIn(newestSession.payload);
  //   }
  // }, [sessionLog]);

  useEffect(() => {
    if (userSignIn && !loading) {
      setTimeout(() => {
        setUserSignIn(null);
      }, 2000);
    }
  }, [userSignIn, loading]);

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: document.querySelector('.scanner'),
          constraints: {
            width: 800,
            height: 600,
          },
        },
        decoder: {
          readers: ['code_128_reader', 'code_39_reader', 'code_39_vin_reader'],
          debug: {
            drawBoundingBox: true,
            showFrequency: false,
            drawScanline: true,
            showPattern: true,
          },
        },
      },
      function (err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log('Initialization finished. Ready to start');
        Quagga.start();
      },
    );
    Quagga.onDetected(handleScan);
  }, []);

  const handleError = (err) => {
    console.log(err);
  };

  const handleSignIn = (id) => {
    sendMessage({ event: 'SIGN_IN', payload: id });
  };

  function handleScan(result) {
    if (result) {
      console.log(result.codeResult.code);
      // setLoading(true);
      // handleSignIn(result.text);
      audioRef.current.play();
    }
  }

  return (
    <StyledScanner>
      {loading ? (
        <h1>Please wait...</h1>
      ) : userSignIn ? (
        <h1>{`${userSignIn} signed in!`}</h1>
      ) : (
        <div className="scanner" style={{ height: 500 }} />
      )}
      <audio src={beep} ref={audioRef} />
    </StyledScanner>
  );
}

export default Scanner;

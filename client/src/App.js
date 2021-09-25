import React from 'react';
import styled from 'styled-components';
import './App.css';
import Header from './components/Header';
import SessionLayout from './components/layouts/SessionLayout';
import SocketProvider from './store/SocketProvider';

export const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
`;

function App() {
  return (
    <StyledApp>
      <Header />
      <SocketProvider>
        <SessionLayout />
        {/* <TestDownload /> */}
      </SocketProvider>
    </StyledApp>
  );
}

export default App;

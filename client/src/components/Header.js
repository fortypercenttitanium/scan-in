import React from 'react';
import styled from 'styled-components';
import Nav from './Nav';

const StyledHeader = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: auto 0 auto 24px;
  .logo {
    font-family: StarJedi, sans-serif;
    font-size: 5rem;
  }
`;

function Header() {
  return (
    <StyledHeader>
      <h1 className="logo">Scan-in</h1>
      <Nav />
    </StyledHeader>
  );
}

export default Header;

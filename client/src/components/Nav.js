import React, { useContext } from 'react';
import styled from 'styled-components';
import { Store } from '../store/Provider';

const StyledNav = styled.nav`
  display: flex;
  margin: auto 24px auto auto;
`;

function Nav() {
  const { userData } = useContext(Store);
  return (
    <StyledNav>
      <div className="login">
        {userData ? (
          <h2 className="login-text">Hi, {userData.firstName}</h2>
        ) : (
          <a href="http://localhost:5000/auth/microsoft">
            <h2 className="login-text">Login</h2>
          </a>
        )}
      </div>
    </StyledNav>
  );
}

export default Nav;

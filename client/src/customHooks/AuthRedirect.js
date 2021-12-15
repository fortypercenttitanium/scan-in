import React, { useContext } from 'react';
import {} from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { UserStore } from '../store/UserProvider';
import Loading from '../components/Loading/Loading';

function AuthRedirect({ children }) {
  const { userData } = useContext(UserStore);

  return !userData ? (
    <Redirect to="/" />
  ) : userData.loading ? (
    <Loading />
  ) : (
    <>{children}</>
  );
}

export default AuthRedirect;

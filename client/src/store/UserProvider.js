import React, { createContext, useState, useEffect } from 'react';
import useDatabase from '../customHooks/useDatabase';
export const UserStore = createContext();

const url =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/db/userData'
    : '/db/userData';

function UserProvider({ children }) {
  const [userData, setUserData] = useState({ loading: true });
  const { classes, sessions, openSession, requestHydrate, loading } =
    useDatabase({
      userData,
    });

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await fetch(url, {
          credentials: 'include',
        });

        if (request.ok) {
          const response = await request.json();
          setUserData(response);
        } else {
          setUserData(null);
        }
      } catch (err) {
        console.error(err);
        setUserData(null);
      }
    }

    fetchData();
  }, [setUserData]);

  return (
    <UserStore.Provider
      value={{
        userData,
        setUserData,
        classes,
        sessions,
        openSession,
        requestHydrate,
        loading,
      }}
    >
      {children}
    </UserStore.Provider>
  );
}

export default UserProvider;

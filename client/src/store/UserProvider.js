import React, { createContext, useState, useEffect } from 'react';
export const UserStore = createContext();

const url =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/db/userData'
    : '/db/userData';

function UserProvider({ children }) {
  const [userData, setUserData] = useState({ loading: true });

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
        console.log('No user found');
        setUserData(null);
      }
    }

    fetchData();
  }, [setUserData]);

  return (
    <UserStore.Provider value={{ userData, setUserData }}>
      {children}
    </UserStore.Provider>
  );
}

export default UserProvider;

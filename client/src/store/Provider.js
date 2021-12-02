import React, { createContext, useState, useEffect } from 'react';
export const Store = createContext();

const url =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/db/userData'
    : '/db/userData';

function Provider({ children }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await fetch(url, {
          credentials: 'include',
        });

        if (request.ok) {
          const response = await request.json();
          setUserData(response);
        }
      } catch (err) {
        console.log('No user found');
      }
    }

    fetchData();
  }, [setUserData]);

  return (
    <Store.Provider value={{ userData, setUserData }}>
      {children}
    </Store.Provider>
  );
}

export default Provider;

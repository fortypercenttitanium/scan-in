import { useEffect, useState } from 'react';
import JsonFetcher from '../helperFunctions/fetchers/JsonFetcher';

const fetcher = new JsonFetcher();

function useDatabase({ userData }) {
  const [classes, setClasses] = useState([]);
  const [openSession, setOpenSession] = useState({});
  const [sessions, setSessions] = useState([]);
  const [dataShouldHydrate, setDataShouldHydrate] = useState([
    'classes',
    'openSessions',
    'sessions',
  ]);

  function requestHydrate(type) {
    setDataShouldHydrate([...dataShouldHydrate, type]);
  }

  const loading = !!dataShouldHydrate.length;

  useEffect(() => {
    if (userData && !userData.loading) {
      async function getClasses() {
        try {
          const data = await fetcher.fetch('/db/classes');

          if (data) {
            setClasses(data);
          }
        } catch (err) {
          console.log(err);
        }
      }

      async function getOpenSessions() {
        try {
          const data = await fetcher.fetch('/db/openSessions');
          if (data && data.length) {
            setOpenSession(data[0]);
          } else {
            setOpenSession('');
          }
        } catch (err) {
          console.log(err);
        }
      }

      async function getSessions() {
        try {
          const data = await fetcher.fetch('/db/sessions');

          if (data) {
            setSessions(data);
          }
        } catch (err) {
          console.log(err);
        }
      }

      async function hydrateData() {
        if (dataShouldHydrate.length) {
          const classesShouldHydrate = dataShouldHydrate.filter(
            (item) => item === 'classes',
          ).length;
          const sessionsShouldHydrate = dataShouldHydrate.filter(
            (item) => item === 'sessions',
          ).length;
          const openSessionsShouldHydrate = dataShouldHydrate.filter(
            (item) => item === 'openSessions',
          ).length;

          const dataDidHydrate = [];

          if (classesShouldHydrate) {
            await getClasses();
            dataDidHydrate.push('classes');
          }

          if (sessionsShouldHydrate) {
            await getSessions();
            dataDidHydrate.push('sessions');
          }

          if (openSessionsShouldHydrate) {
            await getOpenSessions();
            dataDidHydrate.push('openSessions');
          }

          setDataShouldHydrate(
            dataShouldHydrate.filter((item) => !dataDidHydrate.includes(item)),
          );
        }
      }

      hydrateData();
    }
  }, [setClasses, dataShouldHydrate, userData]);

  return {
    classes,
    sessions,
    openSession,
    requestHydrate,
    loading,
  };
}

export default useDatabase;

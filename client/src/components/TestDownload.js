import React, { useEffect, useState } from 'react';

function TestDownload() {
  const [classes, setClasses] = useState([]);

  const downloadURLPrefix =
    process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';

  useEffect(() => {
    async function getClasses() {
      try {
        const response = await fetch('/db/classes', {
          credentials: 'include',
          method: 'GET',
        });
        if (response.ok) {
          const json = await response.json();
          setClasses(json);
        }
      } catch (err) {
        console.log(err);
      }
    }
    getClasses();
  }, [setClasses]);

  async function handleGetDownloadLink(classObj) {
    try {
      const req = await fetch('/db/barcodes', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ ids: classObj.students }),
        headers: {
          'Content-type': 'application/json',
        },
      });

      if (req.ok) {
        const link = await req.json();

        const newClasses = [...classes];
        const thisClass = newClasses.find(
          (newClass) => newClass.id === classObj.id,
        );
        thisClass.downloadLink = link;

        setClasses(newClasses);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      {classes.map((classObj) => {
        return (
          <div key={classObj.id} style={{ display: 'block' }}>
            <button onClick={() => handleGetDownloadLink(classObj)}>
              {classObj.name}
            </button>
            {classObj.downloadLink && (
              <a
                href={`${downloadURLPrefix}/download/${classObj.downloadLink}`}
                download
                target="_blank"
                rel="noreferrer"
              >
                Click to download barcodes
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TestDownload;

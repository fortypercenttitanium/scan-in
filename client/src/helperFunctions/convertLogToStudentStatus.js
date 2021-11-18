export default function convertLogToStudentStatus({ log, students }) {
  return students.map((student) => {
    let status = 'absent';
    let signInTime = null;

    const signInData = log.filter(
      (log) => log.event === 'scan-in' && log.payload === student.id,
    );

    if (signInData.length) {
      status = 'present';
      signInTime = signInData[0].timeStamp;
    }

    return {
      ...student,
      status,
      signInTime,
    };
  });
}

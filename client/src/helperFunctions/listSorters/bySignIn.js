export default function bySignIn(students, status) {
  const studentsCopy = students.map((student) => ({
    ...student,
  }));

  function presentFirst(studentA, studentB) {
    // if sorting present first, sort by sign in time
    if (!studentA.signInTime) {
      return 2;
    }
    if (!studentB.signInTime) {
      return -2;
    }
    return Number(studentA.signInTime) < Number(studentB.signInTime) ? -1 : 1;
  }

  function absentFirst(studentA, studentB) {
    // if absent, sort first, if present, sort by reverse sign in time
    return studentA.status === 'absent'
      ? -2
      : Number(studentA.signInTime) > Number(studentB.signInTime)
      ? -1
      : 1;
  }

  switch (status) {
    case 'present':
      return studentsCopy.sort(presentFirst);
    case 'absent':
      return studentsCopy.sort(absentFirst);
    default:
      return studentsCopy.sort(presentFirst);
  }
}

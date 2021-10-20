export default function byName(students, firstOrLast) {
  const studentsCopy = students.map((student) => ({
    ...student,
  }));

  function lastName(studentA, studentB) {
    return studentA.lastName < studentB.lastName ? -1 : 1;
  }

  function firstName(studentA, studentB) {
    return studentA.firstName < studentB.firstName ? -1 : 1;
  }

  switch (firstOrLast) {
    case 'last':
      return studentsCopy.sort(lastName);
    case 'first':
      return studentsCopy.sort(firstName);
    default:
      return studentsCopy.sort(lastName);
  }
}

export default function studentStatusToCsv(studentData) {
  return studentData.reduce((acc, val) => {
    acc += `${val.id},${val.firstName},${val.lastName},${val.status},${
      val.signInTime
        ? new Date(Number(val.signInTime)).toLocaleTimeString()
        : ''
    }\n`;

    return acc;
  }, 'ID,First Name,Last Name,Status,Sign In Time\n');
}

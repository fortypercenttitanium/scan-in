export default function parseStudentData(data) {
  const regex = /^[A-Za-z-']+, [A-Za-z\-' .]+ \(\d{5,}\)$/;

  if (!regex.test(data)) {
    return null;
  }

  const split = data.split(' ');
  const firstName = split[1];
  const lastName = split[0].replace(',', '');
  const id = split[2].replace(/\(|\)/g, '');

  return {
    firstName,
    lastName,
    id,
  };
}

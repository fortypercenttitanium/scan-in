export default function parseStudentData(data) {
  const regex = /^[A-Za-z-' ]+, [A-Za-z\-' .]+ \(\d{5,}\)$/;

  if (!regex.test(data)) {
    return null;
  }

  const split = data.split(',').map((data) => data.trim());
  const lastName = split[0].trim();
  const endFirstIndex = split[1].indexOf('(');
  const id = split[1].slice(endFirstIndex).replace(/\(|\)/g, '');
  const firstName = split[1].slice(0, endFirstIndex).trim();

  return {
    firstName,
    lastName,
    id,
  };
}

export default function parseStudentData(data) {
  const regex = /^[A-Za-z-']+, [A-Za-z\-' .]+ \(\d{5,}\)$/;

  if (!regex.test(data)) {
    return null;
  }

  const split = data.split(' ').map((data) => data.trim());
  const lastName = split[0].replace(',', '');
  const firstName = split.slice(1, split.length - 1).join(' ');
  const id = split[split.length - 1].replace(/\(|\)/g, '');

  return {
    firstName,
    lastName,
    id,
  };
}

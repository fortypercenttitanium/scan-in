export default function formatStudentList(data) {
  // split into array
  const split = data.split('\n');

  // remove numbers
  const numbersRemoved = split.map((entry) =>
    entry.replace(/\d+\./, '').trim(),
  );

  return numbersRemoved.join('\n');
}

export default function getLogTime(log) {
  return new Date(Number(log[log.length - 1].timeStamp)).toLocaleTimeString();
}

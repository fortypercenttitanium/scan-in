import { nanoid } from 'nanoid';

class LogEntry {
  constructor({ event, payload }) {
    this.id = nanoid();
    this.event = event;
    this.payload = payload;
    this.timeStamp = new Date();
  }
}

export default LogEntry;

const { nanoid } = require('nanoid');

class LogEntry {
  constructor({ event, payload }) {
    this.id = nanoid();
    this.event = event;
    this.payload = payload;
    this.timeStamp = new Date();
  }
}

module.exports = LogEntry;

const sessionByMostRecent = (sessions) =>
  sessions
    .sort((a, b) => (a.startTime > b.startTime ? -1 : 1))
    .sort((a, b) =>
      new Date(a.date).getTime() > new Date(b.date).getTime() ? -1 : 1,
    );

export default sessionByMostRecent;

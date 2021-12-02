const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/authRouter');
const dbRouter = require('./routes/dbRouter');
const downloadRouter = require('./routes/downloadRouter');
const apolloServer = require('./db/apolloServer');
const wss = require('./socketServer');

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 5000;

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000',
    }),
  );
  app.use(express.json());
  app.use(cookieParser());

  app.use(express.static(path.resolve(__dirname, '../client/build')));

  app.use('/auth', authRouter);
  app.use('/db', dbRouter);
  app.use('/download', downloadRouter);

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
  });

  const server = app.listen(PORT, () =>
    console.log(`Server listening on port ${PORT}...\nGraphQL server listening at http://localhost:${PORT}${apolloServer.graphqlPath}
    `),
  );

  server.on('upgrade', function (request, socket, head) {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  });
}

startServer();

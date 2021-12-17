import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import dbRouter from './routes/dbRouter.js';
import apolloServer from './db/apolloServer.js';
import wss from './socketServer.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRouter');
const dbRouter = require('./routes/dbRouter');
require('./db/apolloServer');
require('./socketServer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use('/auth', authRouter);

app.use('/db', dbRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));

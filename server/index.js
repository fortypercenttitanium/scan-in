const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('*', () => {
  res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));

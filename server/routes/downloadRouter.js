const router = require('express').Router();
const { writeFile, unlink } = require('fs/promises');
const { gql } = require('graphql-request');
const query = require('../helperFunctions/queryHelper');

router.get('/expired', (req, res) => {
  res.send('Download link expired, please try again with a new link.');
});

router.get('/invalid', (req, res) => {
  res.send('Download link invalid. Please try again.');
});

router.get('/:token', async (req, res, next) => {
  try {
    const token = req.params.token;

    const GET_DOWNLOAD = gql`
      query ($token: ID!) {
        csvDownload(token: $token) {
          data
          expires
        }
      }
    `;

    const result = await query(GET_DOWNLOAD, { token });

    const now = new Date().getTime();

    if (!result.csvDownload) {
      return res.redirect('/download/invalid');
    }

    if (result.csvDownload.expires < now) {
      return res.redirect('/download/expired');
    }

    const { data } = result.csvDownload;

    await writeFile('data.csv', data);

    res.download('./data.csv', `${token}.csv`, async function (err) {
      if (err) {
        console.error(err);
      } else {
        await unlink('./data.csv');
      }
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

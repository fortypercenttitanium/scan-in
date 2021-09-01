const router = require('express').Router();
const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');
const { gql } = require('graphql-request');
const query = require('../helperFunctions/queryHelper');
const idToBarcode = require('../helperFunctions/idToBarcode');
const zipFiles = require('../helperFunctions/zipFiles');

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
      query Download($token: ID!) {
        download(token: $token) {
          data
          expires
        }
      }
    `;

    const result = await query(GET_DOWNLOAD, { token });

    const now = new Date().getTime();

    if (!result.download) {
      return res.redirect('/download/invalid');
    }

    if (result.download.expires < now) {
      return res.redirect('/download/expired');
    }

    const ids = result.download.data;

    const barcodes = idToBarcode(ids).map((barcode, index) => ({
      name: `${ids[index]}.svg`,
      data: barcode,
    }));

    if (!fs.existsSync(path.join(__dirname, 'temp')))
      fs.mkdirSync(path.join(__dirname, 'temp'));

    await zipFiles(
      barcodes,
      path.join(__dirname, 'temp', `${result.download.token}.zip`),
    );

    res.download(
      path.join(__dirname, 'temp', `${result.download.token}.zip`),
      'barcodes.zip',
      async () => {
        try {
          await fsPromises.rm(path.join(__dirname, 'temp'), {
            recursive: true,
          });
          console.log('Cleanup finished');
        } catch (err) {
          console.log(err);
        }
      },
    );
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

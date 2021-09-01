const router = require('express').Router();
const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');
const passport = require('../auth/passport');
const { gql } = require('graphql-request');
const query = require('../helperFunctions/queryHelper');
const { nanoid } = require('nanoid');
const idToBarcode = require('../helperFunctions/idToBarcode');
const zipFiles = require('../helperFunctions/zipFiles');
require('dotenv').config();

router.use(passport.authenticate('jwt', { session: false }));

router.get('/userData', (req, res) => {
  res.json(req.user);
});

router.get('/classes', async (req, res) => {
  const CLASS_LIST = gql`
    query ClassList($userId: ID!) {
      classList(userId: $userId) {
        id
        name
        students
      }
    }
  `;

  const result = await query(CLASS_LIST, { userId: req.user.id });

  res.json(result.classList);
});

router.post('/class', async (req, res) => {
  const { classData } = req.body;

  classData.id = nanoid();
  classData.owner = req.user.id;

  const NEW_CLASS = gql`
    mutation addClass($name: String!, $students: [ID]!, $owner: ID!, $id: ID!) {
      addClass(name: $name, students: $students, owner: $owner, id: $id) {
        id
        owner
        students
      }
    }
  `;

  const result = await query(NEW_CLASS, classData);

  res.json(result);
});

router.get('/class', async (req, res) => {
  const CLASS = gql`
    query Class($id: ID!, $userId: ID!) {
      class(id: $id, userId: $userId) {
        id
        name
        students
      }
    }
  `;

  const result = await query(CLASS, { id: req.body.id, userId: req.user.id });

  res.json(result.class);
});

router.post('/barcodes', async (req, res, next) => {
  try {
    // TODO: use IDs to get all student info, send to barcodes for custom text
    // Modify class mutation to take student first and last names, assign ID, and create new student

    const ids = req.body.ids;

    const ADD_DOWNLOAD = gql`
      mutation AddDownload($data: [String]!) {
        addDownload(data: $data) {
          data
          token
          expires
        }
      }
    `;

    const result = await query(ADD_DOWNLOAD, { data: ids });

    res.json(result.addDownload.token);
  } catch (err) {
    return next(err);
  }
});

router.use('*', (req, res) => {
  res.redirect('/');
});

module.exports = router;

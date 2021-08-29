const router = require('express').Router();
const passport = require('../auth/passport');
const { gql } = require('graphql-request');
const query = require('../helperFunctions/queryHelper');
const { nanoid } = require('nanoid');
require('dotenv').config();

router.use(passport.authenticate('jwt', { session: false }));

router.get('/userData', (req, res) => {
  res.json(req.user);
});

router.get('/classList', async (req, res) => {
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

module.exports = router;

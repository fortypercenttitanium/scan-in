const router = require('express').Router();
const passport = require('../auth/passport');
const { gql } = require('graphql-request');
const query = require('../helperFunctions/queryHelper');
require('dotenv').config();

router.use(passport.authenticate('jwt', { session: false }));

router.get('/userData', (req, res) => {
  res.send('success!');
});

module.exports = router;

const router = require('express').Router();
const passport = require('../auth/passport');
const jwt = require('jsonwebtoken');
const { gql } = require('graphql-request');
const query = require('../helperFunctions/queryHelper');
require('dotenv').config();

router.get(
  '/microsoft',
  passport.authenticate('microsoft', { session: false }),
  () => {},
);

router.get('/microsoft/cb', (req, res, next) => {
  passport.authenticate(
    'microsoft',
    {
      session: false,
    },
    (err, user) => {
      if (err) return next(err);
      if (!user) return res.sendStatus(401);

      const accessToken = createAccessToken(user);

      res
        .status(201)
        .cookie('scan_in_access_token', accessToken, {
          secure: true,
          httpOnly: true,
          encode: String,
        })
        .redirect('/');
    },
  )(req, res, next);
});

router.delete('/logout', (req, res) => {
  req.logout();
  res.clearCookie('scan_in_access_token').sendStatus(200);
});

router.delete(
  '/user',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const q = gql`
      mutation deleteUser($id: ID!) {
        deleteUser(id: $id) {
          id
        }
      }
    `;

    const result = await query(q, { id: req.user.id });

    if (result.deleteUser === null) {
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  },
);

function createAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
}

module.exports = router;

const router = require('express').Router();
const passport = require('../auth/passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let refreshTokens = [];

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
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

      refreshTokens.push(refreshToken);

      res
        .status(201)
        .cookie('scan_in_access_token', accessToken, {
          secure: true,
          httpOnly: true,
          encode: String,
        })
        .cookie('scan_in_refresh_token', refreshToken, {
          secure: true,
          httpOnly: true,
          encode: String,
        })
        .redirect('/');
    },
  )(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.clearCookie('scan_in_access_token');
  res.clearCookie('scan_in_refresh_token');
  res.redirect('/');
});

router.post('/token', (req, res) => {
  const refreshToken = req.cookies['scan_in_refresh_token'];

  if (refreshToken && refreshTokens.includes(refreshToken)) {
    return jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, user) => {
        if (err) res.sendStatus(403);
        const { firstName, lastName, email } = user;

        const userData = {
          firstName,
          lastName,
          email,
        };

        const newToken = createAccessToken(userData);

        return res
          .cookie('scan_in_access_token', newToken, {
            secure: true,
            httpOnly: true,
            encode: String,
          })
          .sendStatus(201);
      },
    );
  }

  return res.sendStatus(401);
});

router.post(
  '/getUserData',
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res) => {
    // get user
    const dummyData = {
      classes: [{ name: 'test class', id: '1', students: [] }],
    };

    res.json(dummyData);
  },
);

function createAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '1m' });
}

module.exports = router;

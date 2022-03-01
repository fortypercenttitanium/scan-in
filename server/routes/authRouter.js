import { Router } from 'express';
import passport from '../auth/passport.js';
import jwt from 'jsonwebtoken';
import { gql } from 'graphql-request';
import query from '../helperFunctions/queryHelper.js';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

router.get(
  '/microsoft',
  passport.authenticate('microsoft', { session: false }),
  () => {},
);

router.get('/microsoft/cb', (req, res, next) => {
  const redirect =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/'
      : 'https://scan-in.herokuapp.com/microsoft/cb';

  passport.authenticate(
    'microsoft',
    {
      session: false,
    },
    (err, user) => {
      if (err) return next(err);
      if (!user) return res.sendStatus(401);

      const accessToken = createAccessToken(user);

      // set cookie age to 90 days
      const cookieAge = 1000 * 60 * 60 * 24 * 90;

      res
        .status(201)
        .cookie('scan_in_access_token', accessToken, {
          secure: true,
          httpOnly: true,
          encode: String,
          maxAge: cookieAge,
        })
        .redirect(redirect);
    },
  )(req, res, next);
});

router.post('/logout', (req, res) => {
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

export default router;

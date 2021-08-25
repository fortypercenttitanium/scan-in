const MicrosoftStrategy = require('passport-microsoft').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { gql } = require('graphql-request');
const { nanoid } = require('nanoid');
const query = require('../db/query');

require('dotenv').config();

const jwtOptions = {
  jwtFromRequest: getTokenFromCookie,
  secretOrKey: process.env.JWT_SECRET_KEY,
};

const microsoftStrategy = new MicrosoftStrategy(
  {
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/microsoft/cb',
    scope: ['openid', 'profile', 'email', 'offline_access'],
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
      const { name, emails } = profile;

      // build query
      const GET_USER_BY_EMAIL = gql`
        query findUserByEmail($email: String!) {
          user(email: $email) {
            id
            firstName
            lastName
            email
            classes {
              students {
                firstName
                lastName
              }
            }
          }
        }
      `;

      // find a user in the database
      let { user } = await query(GET_USER_BY_EMAIL, { email: emails[0].value });

      console.log(user);

      // create a new user
      if (!user) {
        user = {
          id: nanoid(),
          firstName: name.givenName,
          lastName: name.familyName,
          email: emails[0].value,
        };
        // save to db
        const mutation = gql`
          mutation AddUser(
            $id: ID!
            $firstName: String!
            $lastName: String!
            $email: String!
          ) {
            addUser(
              id: $id
              firstName: $firstName
              lastName: $lastName
              email: $email
            ) {
              id
              firstName
              lastName
              email
            }
          }
        `;

        query(mutation, user);
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
);

const jwtStrategy = new JwtStrategy(jwtOptions, (jwt, done) => {
  // apollo query for user
  return done(null, jwt);
});

function getTokenFromCookie(req) {
  return req ? req.cookies['scan_in_access_token'] : null;
}

module.exports = { microsoftStrategy, jwtStrategy };

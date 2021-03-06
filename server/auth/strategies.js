import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { gql } from 'graphql-request';
import { nanoid } from 'nanoid';
import query from '../helperFunctions/queryHelper.js';
import dotenv from 'dotenv';

dotenv.config();

const GET_USER_BY_EMAIL = gql`
  query findUserByEmail($email: String!) {
    user(email: $email) {
      id
      firstName
      lastName
      email
    }
  }
`;

const GET_USER_BY_ID = gql`
  query findUserByID($id: ID!) {
    userByID(id: $id) {
      id
      firstName
      lastName
      email
    }
  }
`;

const jwtOptions = {
  jwtFromRequest: getTokenFromCookie,
  secretOrKey: process.env.JWT_SECRET_KEY,
};

const callbackURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/auth/microsoft/cb'
    : 'https://scan-in.herokuapp.com/auth/microsoft/cb';

const microsoftStrategy = new MicrosoftStrategy(
  {
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL,
    scope: ['user.read'],
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
      const { name, emails } = profile;
      console.log(profile);

      // find a user in the database
      let { user } = await query(GET_USER_BY_EMAIL, {
        email: emails[0].value,
      });

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

        await query(mutation, user);
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
);

const jwtStrategy = new JwtStrategy(jwtOptions, async (jwt, done) => {
  const GET_USER_BY_ID = gql`
    query findUserByID($id: ID!) {
      userByID(id: $id) {
        id
        firstName
        lastName
        email
      }
    }
  `;

  const userQuery = await query(GET_USER_BY_ID, { id: jwt.id });
  const userData = userQuery.userByID;

  return done(null, userData);
});

function getTokenFromCookie(req) {
  return req.cookies ? req.cookies['scan_in_access_token'] : null;
}
export default { microsoftStrategy, jwtStrategy };

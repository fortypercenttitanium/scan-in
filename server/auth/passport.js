const passport = require('passport');
const strategies = require('./strategies');

const { microsoftStrategy, jwtStrategy } = strategies;

passport.use(microsoftStrategy);
passport.use(jwtStrategy);

module.exports = passport;

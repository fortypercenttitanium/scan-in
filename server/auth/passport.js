import passport from 'passport';
import strategies from './strategies.js';

const { microsoftStrategy, jwtStrategy } = strategies;

passport.use(microsoftStrategy);
passport.use(jwtStrategy);

export default passport;

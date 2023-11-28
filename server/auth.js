import passport from "passport";
import 'dotenv/config'
import { Strategy as jwtStrategy, ExtractJwt } from "passport-jwt";
import { findUserById } from './supabase.js'

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
}

passport.use(new jwtStrategy(options, async (jwt_payload, done) => {
    try {
        const user = await findUserById(jwt_payload.sub); 
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

export default passport;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Buyer = require('../models/Buyer'); 

passport.use('local',
    new LocalStrategy(
        {
            usernameField: 'username', 
        },
        async (username, password, done) => {
            try {
                const buyer = await Buyer.findOne({ username });
                if (!buyer) {
                    return done(null, false, { message: 'Incorrect username' });
                }
                if (!buyer.verifyPassword(password)) {
                    return done(null, false, { message: 'Incorrect password' });
                }
                return done(null, buyer);
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((buyer, done) => {
    done(null, buyer.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const buyer = await Buyer.findById(id);
        done(null, buyer);
    } catch (error) {
        done(error);
    }
});

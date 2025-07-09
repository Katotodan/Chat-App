const passport = require('passport')
const LocalStrategy = require('passport-local')
const { UserModel } = require('../DB/DBmodel.js')
const bcrypt = require('bcrypt');
require('dotenv').config();

const PEPPER = process.env.PEPPER;


passport.use(new LocalStrategy(async function verify(username, password, cb) {
    try {
        const user = await UserModel.findOne({ username }).exec();

        if (!user) {
        return cb(null, false, { message: 'No account found' });
        }

        bcrypt.compare(password, user.password, function(err, result) {
        if (err) return cb(err);
        if (!result) {
            return cb(null, false, { message: 'Incorrect password' });
        }
        return cb(null, user);
        });
    } catch (err) {
        return cb(err);
    }
    
    
    
}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username, image: user.image });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});  


module.exports = passport;
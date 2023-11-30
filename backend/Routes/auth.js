const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const UserModel = require("../DB/DBmodel")

const router = express.Router();

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await UserModel.find({"username": username})
  if(user.length < 1){
    console.log('No user found')
    return cb(null, false, { message: 'Incorrect username or password.' });
  }else{
    if(user[0].password != password){
      console.log("user password " + user[0].password + "input passord is " + password)
      return cb(null, false, { message: 'Incorrect username or password.' })
    }else{
      console.log(' user found')
      return cb(null, user[0])
    }
  }
  
}));

passport.serializeUser(function(user, cb) {
    cb(null, { id: user.id, username: user.username });
});

passport.deserializeUser(function(user, cb) {
    return cb(null, user); 
});

router.get('/login', function(req, res, next) {
  res.send('login');
});
router.get('/', function(req, res, next) { 
  if(req.user){
    res.status(200).send(req.user)
  }else{
    res.status(400).send('User not defined')
  }
});

router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); } 
    res.redirect('/login');
  });
});



module.exports = router;
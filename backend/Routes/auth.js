const express = require('express');
const {UserModel} = require("../DB/DBmodel")
const passport = require("../Controller/passport.js")

const router = express.Router();





router.get('/login', function(req, res, next) {
  res.status(500).send('Log in fails, username or password incorrect!');
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

// Sing up router
router.post('/signup', async (req, res, next) => {
  try {
    const user = await UserModel.findOne({username: req.body.username}).exec()
    if(!user){
      const user = await UserModel.create({
        "username": req.body.username,
        "password": req.body.password,
        "image": req.body.image
      })
      user.save()
      req.logIn(user, (err) =>{
        if(err) { throw new Error('Something wrong happened, try again.') }
        res.redirect('/')
      })
      
    }else{
      throw new Error('Username already exist')
    }
  } catch (error) {  
    res.status(500).send(error.message)
  }
 
});

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); } 
    res.status(200).send("Log out success!");
  });
});



module.exports = router;
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const {UserModel, MsgModel} = require("../DB/DBmodel")
const multer = require('multer')

const router = express.Router();
const upload = multer()

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
    cb(null, { id: user.id, username: user.username, image: user.image });
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

// Sing up router
router.post('/signup', upload.single('image'), async (req, res, next) => {
  try {
   
    const user = await UserModel.find({"username": req.body.username})
    if(user.length < 1){
      let imageBuffer = ""
      if (req.file.buffer){
        imageBuffer = req.file.buffer
      } 
      const user = await UserModel.create({
        "username": req.body.username,
        "password": req.body.password,
        "image": imageBuffer
      })
      user.save() 
      req.logIn(user, (err) =>{
        if(err) { throw new Error('Something wrong happened, try again.') }
        res.redirect('/')
      })
      
    }else{
      console.log('Something wrong appears')
      throw new Error('Username already exist')
    }
  } catch (error) {
    console.log(error)
    // res.status(500).send(error)
    
  }
 
});

router.get("/conversationList/:currentUser", async function(req,res,next){
  try {
    const conversationList = await UserModel.find({"username" : { $nin: req.params.currentUser }}).limit(10)
    res.json(conversationList)
  } catch (error) {
    res.send([])
    
  }
})

router.get('/getMsg/:userId/:destinationId', async function(req,res,next){
  try {
    const messages = await MsgModel.find({
      $or: [
        { sender: req.params.userId , receiver: req.params.destinationId},
        { receiver: req.params.userId, sender: req.params.destinationId},
      ],

    })
    res.send(messages)
    
  } catch (error) {
    
  }
})

router.post('/postMsg/:userId/:destinationId', async function(req,res,next){
  try {
    const addMsg = await MsgModel.create({
      sender : req.params.userId,
      receiver: req.params.destinationId ,
      message: req.body.textMessage,
    })
    addMsg.save()

    res.send(addMsg)
  } catch (error) {
    
  }
  
})

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); } 
    res.redirect('/login');
  });
});



module.exports = router;
const express = require('express');
const {UserModel, MsgModel} = require("../DB/DBmodel")
const router = express.Router();

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
      console.log(error);
    }
    
})

module.exports = router


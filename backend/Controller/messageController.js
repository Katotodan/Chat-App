const { MsgModel,UserModel } = require("../DB/DBmodel")

const chatList = async function(req,res,next){
    try {
      const conversations = await MsgModel.aggregate([
        // Find all message with sender or receiver is equal to currentUserId
        {
          $match: {
            $or: [
              { sender: req.params.currentUserId },
              { receiver: req.params.currentUserId }
            ]
          }
        },
        // Group by sender and receiver, keeping only the latest message in each group
        {
          $group: {
            _id: { sender: "$sender", receiver: "$receiver" },
          }
        },

      ])
      // Filtering the conversationList
      const conversationList = conversations.map(element =>{
          if(element._id["sender"] === req.params.currentUserId){
            return({
              _id: element._id["receiver"],
            })
          }
          return({
            _id: element._id["sender"],
          })
      })
      // Get all the user inside conversationList
      console.log(conversationList);
      const users = await UserModel.find({
        $or: conversationList
      }).exec()
      res.json(users)
    } catch (error) {
      console.log(error);
      res.send([])
      
    }
}

const searchByName = async (req,res,next)=>{
  try {
    // Search user with username simular to req.params.contactName
    const data = req.params.contactName
    const user = await UserModel.find({"username": { $regex: new RegExp(data, 'i')}})
    res.status(200).json(user)
  } catch (error) {
    
  }
}
const lastMsg = async(req, res, next)=>{
  try {
    const messages = await MsgModel.aggregate([
      // Find all message with sender or receiver is equal to currentUserId
      {
        $match: {
          $or: [
            {
              $and: [
                { sender: req.params.constactId },
                { receiver: req.params.userId }
              ],
              $and: [
                { receiver: req.params.constactId },
                { sender: req.params.userId }
              ],
            }
          ]
        }
      },
    ])
    res.json({
      "lastMsg": messages.at(-1)["message"],
      "time": messages.at(-1)["time"]
    })

  } catch (error) {
    
  }
}

// Getting all the chatList, I have just the id and last message for now.
module.exports = {chatList, searchByName, lastMsg}
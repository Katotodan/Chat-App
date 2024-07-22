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
            latestMessage: { $first: "$$ROOT" }
          }
        },

        ])

        // Filtering the conversationList
        const conversationList = conversations.map(element =>{
            console.log(element._id["sender"]);
            if(element._id["sender"] === req.params.currentUserId){
                return(
                    {
                        id: element._id["receiver"],
                        lastmessage: element.latestMessage["message"]
                    }
                )
            }
            return(
                {
                    id: element._id["sender"],
                    lastmessage: element.latestMessage["message"]
                }
            )
        })
      res.json(conversationList)
    } catch (error) {
      console.log(error);
      res.send([])
      
    }
}

// Getting all the chatList, I have just the id and last message for now.
module.exports = {chatList}
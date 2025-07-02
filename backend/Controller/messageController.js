const { MsgModel,UserModel } = require("../DB/DBmodel")

// const chatList = async function(req,res){
//     try {
//       const conversations = await MsgModel.aggregate([
//         // Find all message with sender or receiver is equal to currentUserId
//         {
//           $match: {
//             $or: [
//               { sender: req.params.currentUserId },
//               { receiver: req.params.currentUserId }
//             ]
//           }
//         },
//         // Group by sender and receiver, keeping only the latest message in each group
//         {
//           $group: {
//             _id: { sender: "$sender", receiver: "$receiver" },
//           }
//         },

//       ])
//       // Filtering the conversationList
//       const conversationList = conversations.map(element =>{
//           if(element._id["sender"] === req.params.currentUserId){
//             return({
//               _id: element._id["receiver"],
//             })
//           }
//           return({
//             _id: element._id["sender"],
//           })
//       })
//       // Get all the user inside conversationList
//       const users = await UserModel.find({
//         $or: conversationList
//       }).exec()
//       res.json(users)
//     } catch (error) {
//       console.log(error);
//       res.send([])
      
//     }
// }


// Get chat list (unique users this user has conversations with)
const chatList = async (req, res) => {
  try {
    const currentUserId = req.params.currentUserId;

    const conversations = await MsgModel.aggregate([
      {
        $match: {
          $or: [
            { sender: currentUserId },
            { receiver: currentUserId }
          ]
        }
      },
      {
        $sort: { time: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", currentUserId] },
              "$receiver",
              "$sender"
            ]
          },
          latestMessage: { $first: "$message" },
          time: { $first: "$time" }
        }
      }
    ]);

    // Get full user info for chat list
    const userIds = conversations.map(conv => conv._id);
    const users = await UserModel.find({ _id: { $in: userIds } });

    const enrichedList = users.map(user => {
      const convo = conversations.find(c => c._id.toString() === user._id.toString());
      return {
        image: user["image"],
        username: user["username"],
        _id: user["_id"],
        lastMessage: convo?.latestMessage,
        time: convo?.time
      };
    });
 
    res.status(200).json(enrichedList);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
};

// Search users by username
const searchByName = async (req, res) => {
  try {
    const searchname = req.params.contactName;
    const users = await UserModel.find({
      username: { $regex: new RegExp(searchname, 'i') }
    }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
};

const lastMsg = async (req, res) => {
  try {
    const userId = req.params.userId;
    const contactId = req.params.contactId;

    const messages = await MsgModel.find({
      $or: [
        { sender: userId, receiver: contactId },
        { sender: contactId, receiver: userId }
      ]
    }).sort({ time: -1 }).limit(1);

    if (messages.length === 0) {
      return res.status(200).json({ lastMsg: null, time: null });
    }

    const last = messages[0];
    res.status(200).json({ lastMsg: last.message, time: last.time });
  } catch (error) {
    console.error(error);
    res.status(500).json({ lastMsg: null, time: null });
  }
};
// Getting all the chatList, I have just the id and last message for now.
module.exports = {chatList, searchByName, lastMsg}
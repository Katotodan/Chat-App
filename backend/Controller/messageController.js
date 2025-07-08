const { MsgModel,UserModel } = require("../DB/DBmodel")

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
        $sort: { time: 1 } // Ensure messages are ordered by time for correct $last
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", currentUserId] },
              "$receiver", // if sender is me → group by receiver
              "$sender"    // else → group by sender
            ]
          },
          latestMessage: { $last: "$message" },
          time: { $last: "$time" }
        }
      },
      {
        $sort: { time: -1 } // Optional: show most recent conversation first
      }
    ]);

    // Get full user info for chat list
    const userIds = conversations.map(conv => conv._id);
    const users = await UserModel.find({ _id: { $in: userIds } });
    const userMap = new Map(users.map(user => [user._id.toString(), user]));
    const orderedUsers = userIds.map(id => userMap.get(id.toString()));

    const enrichedList = orderedUsers.map(user => {
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
    const currentUserId = req.user.id;
    const users = await UserModel.find({
      username: { $regex: new RegExp(searchname, 'i') },
      _id: { $ne: currentUserId } // Exclude current user
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
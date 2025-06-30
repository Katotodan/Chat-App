const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    }
})

const msgSchema = new mongoose.Schema({
    sender : {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    time : {
        type: Date,
        default: Date.now
    }
})

const UserModel = mongoose.model("users", userSchema)
const MsgModel = mongoose.model('Messages', msgSchema)

module.exports = {UserModel, MsgModel}
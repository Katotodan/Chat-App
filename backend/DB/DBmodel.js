const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: String,
    password: String
})

const UserModel = mongoose.model("users", schema)

module.exports = UserModel
const mongoose = require('mongoose')

const blacklistSchema = new mongoose.Schema(
    {
        token:{
            type:String,
            required: [true,"token is required"]
        }
    },
    {timestamps:true})

const TokenBlacklist = mongoose.model("TokenBlacklist",blacklistSchema)

module.exports = TokenBlacklist
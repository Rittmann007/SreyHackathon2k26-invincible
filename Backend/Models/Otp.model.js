const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true,"Email is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true,"user is required"]
    },
    otpHash: {
        type: String,
        required: [true,"Otp hash is required"]
    }
},{timestamps: true})

// Add TTL index - OTP expires after 600 seconds (10 minutes)
otpSchema.index({createdAt: 1}, {expireAfterSeconds: 600})

const otpModel = mongoose.model("otpModel",otpSchema)

module.exports = otpModel
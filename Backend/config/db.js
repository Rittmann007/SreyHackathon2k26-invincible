const mongoose = require("mongoose")

async function connectdb() {
    try {
        const connectioninstance = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MONGODB connected !! DB host: ${connectioninstance.connection.host}`)
    } catch (error) {
        console.log("MONGODB connection failed",error)
    } 
}

module.exports = connectdb
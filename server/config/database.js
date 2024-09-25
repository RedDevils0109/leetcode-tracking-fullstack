const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose.connect(process.env.URI)
    .then(con => {
        console.log("MongoDB connected successfully")
    })
    .catch(e => {
        console.log("ERROR connecting MongoDB")
    })
}
module.exports = connectDatabase
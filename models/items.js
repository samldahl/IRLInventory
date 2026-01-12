//Importing Stuff

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: String,
    isDailyUse: Boolean,
    weight: Number,
    size: String,
    fraglie: Boolean,
    lastSeen: String,
    category: String,
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

})

const item = mongoose.model('items', itemSchema)

//export to world
module.exports = item


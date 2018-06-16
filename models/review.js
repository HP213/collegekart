var mongoose = require('mongoose')
reviewSchema = mongoose.Schema({
    text : String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
module.exports = mongoose.model('Review',reviewSchema);
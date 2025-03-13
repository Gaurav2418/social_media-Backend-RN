const mongoose = require('mongoose')

const postSchemha = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true,
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
},
{ timestamps: true }
)

module.exports =mongoose.model('post', postSchemha);
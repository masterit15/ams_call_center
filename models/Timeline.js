const { Schema, model, Types } = require('mongoose')
const schema = new Schema({
    text: {type: String, default: ''},
    autor: {type: String, default: ''},
    time: { type: Date, default: Date.now },
    event: {type: String, default: 'Comment'},
})

module.exports = model('Timeline', schema)
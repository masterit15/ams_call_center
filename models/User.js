const {Schema, model, Types} = require('mongoose')
const schema = new Schema({
    login: { type: String, required: true, unique: true },
    // email: { type: String, required: true, unique: true },
    permission: { type: String, default: 'employee'},
    userName: { type: String },
    password: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
})
module.exports = model('User', schema)
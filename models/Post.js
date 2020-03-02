const { Schema, model, Types } = require('mongoose')
const schema = new Schema({
  // _id: { type: Number },
  fio: { type: String, required: true, text: true, index: true },
  text: { type: String, text: true, index: true },
  selectstatus: { type: String, text: true, index: true },
  regNumber: { type: Number},
  address: { type: String, default: "Не обработана", text: true, index: true },
  creDate: { type: Date, default: Date.now, index: true},
  conDate: { type: Date, index: true},
  phoneNumber: { type: String, pattern: "^([0-9]{3}-[0-9]{3}-[0-9]{4}$", text: true, index: true},
  mobileNumber: { type: String, pattern: "^([0-9]{3}-[0-9]{3}-[0-9]{4}$", text: true, index: true},
  owner: { type: Types.ObjectId, ref: 'User' },
  timeline: [{ 
    id: { type: Number, default: 1 },
    event: {type: String, default: 'Comment'},
    text: {type: String, default: ''},
    autor: {type: String, default: ''},
    time: { type: Date, default: Date.now },
  }]
})


module.exports = model('Post', schema)
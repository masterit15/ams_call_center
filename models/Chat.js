const Sequelize = require("sequelize");
const sequelize = require('../db')
const Roster = require('../models/Roster')
const Message = require('../models/Message')
const Chat = sequelize.define("chat", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {type: Sequelize.STRING, allowNull: false},
  type: {type: Sequelize.ENUM, values:['privat', 'public', 'group'], defaultValue: 'privat'}
})
Chat.hasMany(Roster, { onDelete: "cascade"});
Chat.hasMany(Message, { onDelete: "cascade"});
module.exports = Chat
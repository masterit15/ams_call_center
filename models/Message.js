const Sequelize = require("sequelize");
const sequelize = require('../db')
const MessageStatus = require('../models/MessageStatus')
const Message = sequelize.define("messages", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  text: {type: Sequelize.TEXT},
  timestamp: {type: Sequelize.DATE}
})
Message.hasMany(MessageStatus, { onDelete: "cascade"});
module.exports = Message
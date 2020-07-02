const Sequelize = require("sequelize");
const sequelize = require('../db')
const MessagesStatus = sequelize.define("messagessatus", {
  read: {type: Sequelize.BOOLEAN},
  notified: {type: Sequelize.BOOLEAN}
})
module.exports = MessagesStatus
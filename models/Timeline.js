const Sequelize = require("sequelize");
const sequelize = require('../db')
const Timeline = sequelize.define("timeline", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  event: {type: Sequelize.ENUM, values:['comment','edited', 'changestatus', 'created'], defaultValue: 'comment'},
  text: {type: Sequelize.TEXT, allowNull: true},
  file: {type: Sequelize.TEXT, allowNull: true},
  time: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
  autor: {type: Sequelize.STRING, allowNull: true}
})

module.exports = Timeline
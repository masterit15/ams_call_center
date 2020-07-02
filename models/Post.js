const Sequelize = require("sequelize");
const sequelize = require('../db')
const User = require('../models/User')
const Timeline = require('../models/Timeline')
const Post = sequelize.define("post", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  fio: {type: Sequelize.STRING, allowNull: false},
  text: {type: Sequelize.TEXT, allowNull: false},
  selectstatus: {type: Sequelize.ENUM, values:['Все','Не обработан','В работе','Обработана'], defaultValue: 'Не обработан', allowNull: false},
  regnumber: {type: Sequelize.INTEGER, allowNull: false},
  address: {type: Sequelize.STRING, allowNull: false},
  credate: {
    type: Sequelize.DATE, 
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  condate: {type: Sequelize.DATE, allowNull: true},
  phonenumber: {type: Sequelize.STRING, allowNull: false},
  mobilenumber: {type: Sequelize.STRING, allowNull: false},
})
//Post.hasOne(Timeline, { onDelete: "cascade"});
Post.hasMany(Timeline, { onDelete: "cascade"});
module.exports = Post
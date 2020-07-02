const Sequelize = require("sequelize");
const sequelize = require('../db')
const Posts = require('../models/Post')
const Timeline = require('../models/Timeline')
const Chat = require('../models/Chat')
const Roster = require('../models/Roster')
const Message = require('../models/Message')
const MessageStatus = require('../models/MessageStatus')
const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    email: { type: Sequelize.STRING, allowNull: true},
    login: { type: Sequelize.STRING, allowNull: false},
    avatar: { type: Sequelize.TEXT, allowNull: false},
    permission: {type: Sequelize.ENUM, values:['Администратор','Сотрудник'], defaultValue: 'Сотрудник'},
    username: { type: Sequelize.STRING, allowNull: false},
    password: { type: Sequelize.STRING, allowNull: false},
  })

  User.hasMany(Timeline, { onDelete: "cascade"});
  User.hasMany(Chat, { onDelete: "cascade"});
  User.hasMany(Roster, { onDelete: "cascade"});
  Roster.belongsTo(User)
  User.hasMany(Message, { onDelete: "cascade"});
  User.hasMany(MessageStatus, { onDelete: "cascade"});
  User.hasMany(Posts);
module.exports = User
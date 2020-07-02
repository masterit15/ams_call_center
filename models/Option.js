const Sequelize = require("sequelize");
const sequelize = require('../db')
const Option = sequelize.define("option", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  title: {type: Sequelize.STRING, allowNull: false},
  defaultcolor: {type: Sequelize.STRING, allowNull: false},
  accentcolor: {type: Sequelize.STRING, allowNull: false},
  dark: {type: Sequelize.BOOLEAN, allowNull: false},
  background: {type: Sequelize.STRING, allowNull: false},
  //selectstatus: {type: Sequelize.ENUM, values:['Все','Не обработан','В работе','Обработана'], defaultValue: 'Не обработан', allowNull: false},
})
module.exports = Option
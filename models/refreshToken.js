const Sequelize = require("sequelize");
const sequelize = require('../db')
const refreshToken = sequelize.define("refreshToken", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    refreshToken: { type: Sequelize.STRING, allowNull: false},
  })
module.exports = refreshToken
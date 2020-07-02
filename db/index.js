const Sequelize = require("sequelize");
const sequelize = new Sequelize("ams", "root", "root", {
  dialect: "mysql",
  host: "127.0.0.1",
  define: {
    timestamps: false
  }
});
sequelize.sync().then(result=>{
  console.log(result);
})
.catch(err=> {
  console.log(err)
});
module.exports = sequelize;

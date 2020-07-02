const {Router} = require('express')
const User = require('../models/User')
const Option = require('../models/Option')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.get('/', (req, res) => {
  Option.findAll({raw:true})
  .then(options=>{
      return res.json({
          success: true,
          options
      });
  })
  .catch(err=>{
      return res.json({
          success: false,
          message: "Что то пошло не так!",
          err
      });
  });
});
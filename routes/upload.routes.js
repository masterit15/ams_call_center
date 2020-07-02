const {Router} = require('express')
const User = require('../models/User')
const Post = require('../models/Post')
const Timeline = require('../models/Timeline')
const multer  = require("multer")
const router = Router()
 
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
      cb(null, "./uploads");
  },
  filename: (req, file, cb) =>{
      cb(null, Date.now()+ "-" +file.originalname);
  }
});

router.post("/", multer({storage:storageConfig}).single("file"), (req, res, next) => {
    let filedata = req.file; 
    if(!filedata){
        res.status(404).json({
          success: false,
          message: 'Ошибка при загрузке файла',
          err: filedata
      });
    }else{
      res.status(201).json({
        success: true,
        message: 'Файл загружен',
        filedata
    });
    }
});

module.exports = router
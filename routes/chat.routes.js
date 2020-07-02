const {Router} = require('express')
const Chat = require('../models/Chat')
const User = require('../models/User')
const Roster = require('../models/Roster')
const Message = require('../models/Message')
const MessageStatus = require('../models/MessageStatus')
const auth = require('../middleware/auth.middleware')
const router = Router()

// добавление чата
router.post('/', (req, res) => {
  const {name, type, owner, userId, text, read, notified} = req.body
  Chat.create({
    name,
    type,
    userId: owner
  }).then(async chat => {
    await Roster.create({chatId: chat.id,userId})
    await Message.create({chatId: chat.id,userId,text})
          .then(async messages =>{
            await MessageStatus.create({messageId: messages.id,userId,text,read,notified})
          })
      return res.json({
          success: true,
          message: 'Чат успешно создан в базе данных.',
          chat
      });
  }).catch(err => {
      return res.json({
          success: false,
          message: 'Не удалось создать чат',
          err: err
      });
  });

})

// добавление сообщения в чат
router.post('/msg', (req, res) => {
  const {name, type, owner, userId, text, read, notified} = req.body
  Chat.create({
    name,
    type,
    userId: owner
  }).then(async chat => {
    await Roster.create({chatId: chat.id,userId})
    await Message.create({chatId: chat.id,userId,text})
          .then(async messages =>{
            await MessageStatus.create({messageId: messages.id,userId,text,read,notified})
          })
      return res.json({
          success: true,
          message: 'Чат успешно создан в базе данных.',
          chat
      });
  }).catch(err => {
      return res.json({
          success: false,
          message: 'Не удалось создать чат',
          err: err
      });
  });

})

router.get('/:userId', async (req, res) => {
  let userId = req.params.userId
  await Chat.findAll({
    where: {userId},
    include: [
      {
        model: Roster,
        include: [
          {
            model: User,
            include: [{
              model: Message,
              include: [{
                model: MessageStatus,
              }
              ]
            }
            ]
          }
        ]
      }
    ],
  }).then(chat => {
    return res.json({
      success: true,
      chat
    });
  }).catch(err => {
    console.log(err)
    return res.json({
      success: false,
      err
    });
  })

})

module.exports = router
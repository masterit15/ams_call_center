const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const User = require('./models/User')
const Chat = require('./models/Chat')
const Roster = require('./models/Roster')
const Message = require('./models/Message')
const MessageStatus = require('./models/MessageStatus')
const users = require('./User')()

const m = (name, text, id) => ({ name, text, id })
io.on('connection', socket => {
  socket.on('userJoined', async data => {
    var room = 12
    // ищем в базе есть ли уже созданные участники чата
    Roster.findOne({where: {userId: data.id}})
    .then(rosters => {
      //console.log(rosters.dataValues.chatId)
      room = rosters.dataValues.chatId
      socket.join(room)

      users.remove(socket.id)
      users.add({
        id: socket.id,
        login: data.login,
        avatar: data.avatar,
        name: data.username,
        room: room
      })
      // console.log(users.getByRoom(room))
      io.to(room).emit('updateUsers', users.getByRoom(room))
      socket.emit('newMessage', m('admin', `Добро пожаловать ${data.username}.`))
      socket.broadcast
        .to(room)
        .emit('newMessage', m('admin', `Пользователь ${data.username} зашел.`))
    })
    .catch(err => {
      //console.log('error: ',err)
      socket.join(room)
      users.remove(socket.id)
      users.add({
        id: socket.id,
        login: data.login,
        avatar: data.avatar,
        name: data.username,
        room: room
      })
      // console.log(users.getByRoom(room))
      io.to(room).emit('updateUsers', users.getByRoom(room))
      socket.emit('newMessage', m('admin', `Добро пожаловать ${data.username}.`))
      socket.broadcast
        .to(room)
        .emit('newMessage', m('admin', `Пользователь ${data.username} зашел.`))
    })
  })
  // добавление сообщения в чат
  socket.on('createMessage', data => {
    console.log(data)
    const user = users.get(data.id)

    // Chat.create({
    //   name,
    //   type,
    //   userId: owner
    // }).then(async chat => {
    //   await Roster.create({chatId: chat.id,userId})
    //   await Message.create({chatId: chat.id,userId,text})
    //         .then(async messages =>{
    //           await MessageStatus.create({messageId: messages.id,userId,text,read,notified})
    //         })
    //     return res.json({
    //         success: true,
    //         message: 'Чат успешно создан в базе данных.',
    //         chat
    //     });
    // }).catch(err => {
    //     return res.json({
    //         success: false,
    //         message: 'Не удалось создать чат',
    //         err: err
    //     });
    // });



    if (user) {
      io.to(user.room).emit('newMessage', m(user.name, data.text, data.id))
    }
  })

  socket.on('userLeft', (id) => {
    const user = users.remove(id)
    if (user) {
      io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
      io.to(user.room).emit(
        'newMessage',
        m('admin', `Пользователь ${user.name} вышел.`)
      )
    }
  })

  socket.on('disconnect', () => {
    const user = users.remove(socket.id)
    if (user) {
      io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
      io.to(user.room).emit(
        'newMessage',
        m('admin', `Пользователь ${user.name} вышел.`)
      )
    }
  })
})

module.exports = {
  app,
  server
}
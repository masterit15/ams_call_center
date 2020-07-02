const {Router} = require('express')
const bcrypt = require('bcrypt')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const auth = require('../middleware/auth.middleware')
const RefToken = require('../models/refreshToken')
const router = Router()

/*
    метод регистрации
*/
router.post(
    '/register', 
    [
        // check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 8 символов').isLength({options: {min: 8}})
    ],
    async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            })
        }
        const { login, email, username, avatar, permission, password } = req.body 
        const hashedPassword = await bcrypt.hash(password, 12)
        const candidate = await User.findOne({where: {login}})

        if(candidate){
            return res.json({message: 'Такой пользователь уже существует'})
        }
        User.create({
            login, 
            email,
            username,
            avatar, 
            permission, 
            password: hashedPassword
        }).then(users=>{
            return res.status(201).json({ 
                success: true,
                message: 'Пользователь создан',
                users
            })
        }).catch((err)=>{
            return res.status(500).json({
                success: false,
                message: 'Что-то пошло не так, попробуйте еще раз',
                err
            })
        });
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте еще раз'})
    }
})
/*
    метод авторизации
*/
router.post(
    '/login', 
    [
        // check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                error: errors.array(),
                message: 'Некорректные данные при входе в систему'
            })
        }
        //const {email, password} = req.body
        const { login, password } = req.body
        const user = await User.findOne({where: {login}})
        .then(user=>{
            if(!user) return;
            return user.dataValues
        })
        .catch(err=>console.log(err));

        if(!user){
            return res.status(400)
        }

        const isMatch = await bcrypt.compare(password, user.password)
        
        if(!isMatch){
            return res.status(400).json({ message: 'Неверный пароль, попробуйте снова'})
        }
        const accessToken = generateAccessToken(user.id)
        const refreshToken = jwt.sign(user.id, config.get('jwtRefreshSecret'))
        const Rtoken = await RefToken.create({refreshToken})
        res.json({
            success: true,
            accessToken, 
            refreshToken,
            expires_on: genDate(),
            login, 
            userId: user.id, 
            username: user.username,
            avatar: user.avatar
         })

    } catch (e) {
        res.status(500).json({e,message: 'Что-то пошло не так, попробуйте еще раз'})
    }
})

router.post('/token', async (req, res) => {
    const refreshToken = req.query.token
    console.log('refreshToken: ',refreshToken)
    if (refreshToken == null) return res.sendStatus(401)
    await RefToken.findOne({where: {refreshToken}})
    .then(rToken => {
        
        jwt.verify(rToken.dataValues.refreshToken, config.get('jwtRefreshSecret'), (err, user) => {
            if (err) return res.sendStatus(403)
            const accessToken = generateAccessToken(user)
            res.json({ 
                accessToken, 
                refreshToken,
                expires_on: genDate(),
            })
        })
    }).catch(err => {
        return res.sendStatus(403)
    })
  })
  
router.delete('/logout', async (req, res) => {
    const refreshToken = req.query.token
    if (refreshToken == null) return res.sendStatus(401)
    await RefToken.destroy({
        where: {refreshToken}
      })
      return res.json({
        success: true,
    })
  })
function genDate(){
    return Date.now() + 900000
}
function generateAccessToken(user) {
    return jwt.sign({ userId: user }, config.get('jwtSecret'), { expiresIn: '15m' })
}
/*
    метод получения списка пользователей
*/
router.get('/users', paginatedResults(User), (req, res) => {
    return res.json({
        success: true,
        user: res.paginatedResults
    });
});
/*
    метод получения пользователя по ID
*/
router.get('/user/:id', async (req, res) =>{
    let id = req.params.id;
    User.findOne({where: {id}})
        .then(user=>{
            if(!user) return;
            return res.json({
                success: true,
                message: 'Пользователь найден!',
                user: user
            });
        })
        .catch(err=>{
            return res.json({
                success: false,
                message: 'Пользователь не найден!',
                err: err
            });
        });

})    
/*
    метод обновления пользователя по ID
*/
router.put('/edit', async (req, res) => {
    const { login, email, username, avatar, permission, password } = req.body
    let id = req.body.id
    // если пароль не менялся
    if (password !== ''){
        const hashedPassword = await bcrypt.hash(password, 12)
        password = hashedPassword
        User.update({
            login,
            email,
            username,
            avatar,
            permission,
            password
        }, {
            where: {id}
          }).then(users => {
            return res.json({
                success: true,
                message: 'Пользователь обновлен',
                users
            });
          })
          .catch((err) => {
            return res.json({
                success: false,
                message: 'Не удается обновить пользователя',
                err: err
            });
          })
    }
    // если аватар не менялся
    if (avatar !== ''){
        const hashedPassword = await bcrypt.hash(password, 12)
        password = hashedPassword
        User.update({
            login,
            username,
            avatar,
            permission,
            password
        }, {
            where: {id}
          }).then(users => {
            return res.json({
                success: true,
                message: 'Пользователь обновлен',
                users
            });
          })
          .catch((err) => {
            return res.json({
                success: false,
                message: 'Не удается обновить пользователя',
                err: err
            });
          })
    }
    User.update({
        login,
        username,
        permission,
    }, {
        where: {id}
      }).then(users => {
        return res.json({
            success: true,
            message: 'Пользователь обновлен',
            users
        });
      })
      .catch((err) => {
        return res.json({
            success: false,
            message: 'Не удается обновить пользователя',
            err: err
        });
      })
})
/*
    метод удаления пользователя по ID
*/
router.delete('/delete', auth, (req, res, next) => {
    let id = req.query.id;
    User.destroy({
        where: {id}
      }).then(user => {
        return res.json({
            success: true,
            message: 'Пользователь успешно удален',
            user
        });
      })
      .catch((err) => {
        return res.json({
            success: false,
            message: 'Невозможно удалить пользователя',
            err: err
        });
      })
})
/*
 функция предварительной обработки, сортировки и фильтрации, перед отдачей на клиентскую часть
*/
function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const search = req.query.search
        const searchparam = req.query.searchparam
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const results = {}
        const total = await model.findAll({raw:true})

        results.pagin = {
            currentPage: page,
            total: total.length,
            limit: limit,
            pageCount: Math.ceil(total.length / limit)
        }
        if (endIndex < total.length) {
            results.next = {
                page: page + 1,
            }
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
            }
        }
        try {
            /*
                условие поиска обращений
            */
           results.results = await model.findAll({
            order:[
                ["id"]
            ],
            offset:(startIndex),
            limit : limit,
        })
        res.paginatedResults = results
            // if (search !== '' && search !== undefined) {
            //     if (searchparam == "login") {
            //         results.results = await model.find({ login: { $regex: regsearch } })
            //         res.paginatedResults = results
            //     } else if (searchparam == "permission") {
            //         results.results = await model.find({ permission: { $regex: regsearch } })
            //         res.paginatedResults = results
            //     } else if (searchparam == "userName") {
            //         results.results = await model.find({ userName: { $regex: regsearch } })
            //         res.paginatedResults = results
            //     }
            // } else {
            //     results.results = await model.findAll({
            //         order:[
            //             ["id"]
            //         ],
            //         offset:(startIndex),
            //         limit : limit,
            //     })
            //     res.paginatedResults = results

            //     console.log(results)
            // }

            next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}
module.exports = router
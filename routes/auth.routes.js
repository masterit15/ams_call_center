const {Router} = require('express')
const bcrypt = require('bcrypt')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const auth = require('../middleware/auth.middleware')
const router = Router()

// api/auth/users
router.get('/users', paginatedResults(User), (req, res) => {
    return res.json({
        success: true,
        users: res.paginatedResults
    });
});
// api/auth/register
router.post(
    '/register', 
    [
        // check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 8 символов').isLength({options: {min: 8}})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            })
        }

        // const { email, userName, password } = req.body
        const { login, userName, permission, password } = req.body

        // const candidate = await User.findOne({email})
        const candidate = await User.findOne({ login })

        if(candidate){
            res.status(400).json({message: 'Такой пользователь уже существует'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({
            // email,
            login,
            userName,
            permission,
            password: hashedPassword
        })

        await user.save()
        res.status(201).json({ message: 'Пользователь создан' })

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте еще раз'})
    }
})

// api/auth/login
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
        // const user = await User.findOne({ email })
        const user = await User.findOne({ login })
        if(!user){
            return res.status(400)
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({ message: 'Неверный пароль, попробуйте снова'})
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '12h' }
        )
        res.json({ token, login, userId: user.id, userName: user.userName })

    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте еще раз'})
    }
})
// api/auth/:id
router.get('/user', async (req, res) =>{
    let id = req.query.id;
    User.findOne({
        _id: id
    }).then((user) => {
        return res.json({
            success: true,
            message: 'Пользователь найден!',
            user: user
        });
    }).catch((err) => {
        return res.json({
            success: false,
            message: 'Пользователь не найден!',
            err: err
        });
    });

})    
// api/auth/edit
router.put('/edit', async (req, res) => {

    const { login, userName, permission, password } = req.body
    let id = req.body._id
    await User.findOne({
        _id: id
    }).then( async (user) => {
        user.login = login
        user.userName = userName
        user.permission = permission
        if (password !== ''){
            const hashedPassword = await bcrypt.hash(password, 12)
            user.password = hashedPassword
        }
        user.save()
            .then((user) => {
                return res.json({
                    success: true,
                    message: 'Обращение успешно обновлено',
                });
            }).catch((err) => {
                return res.json({
                    success: false,
                    message: 'Не удается обновить обращение',
                    err: err
                });
            });
    }).catch((err) => {
        return res.json({
            success: false,
            message: 'Ошибка! что-то пошло не так.',
            err: err
        });
    });
})

/*
    метод удаления обращения по ID
*/
router.delete('/delete', auth, (req, res, next) => {
    let id = req.query.id;
    User.findOneAndDelete({
        _id: id
    }).then((user) => {
        return res.json({
            success: true,
            message: 'Пользователь успешно удален',
            user: user
        });
    }).catch((err) => {
        return res.json({
            success: false,
            message: 'Невозможно удалить пользователя',
            err: err
        });
    });
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
        const total = await model.countDocuments().exec()
        results.pagin = {
            currentPage: page,
            total: total,
            limit: limit,
            pageCount: Math.ceil(total / limit)
        }
        if (endIndex < await model.countDocuments().exec()) {
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
            if (search !== '' && search !== undefined) {
                var regsearch = new RegExp("" + search + "");
                if (searchparam == "login") {
                    results.results = await model.find({ login: { $regex: regsearch } })
                    res.paginatedResults = results
                } else if (searchparam == "permission") {
                    results.results = await model.find({ permission: { $regex: regsearch } })
                    res.paginatedResults = results
                } else if (searchparam == "userName") {
                    results.results = await model.find({ userName: { $regex: regsearch } })
                    res.paginatedResults = results
                }
            } else {
                    results.results = await model.find().limit(limit).skip(startIndex).exec()
                    res.paginatedResults = results
            }

            next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}
module.exports = router
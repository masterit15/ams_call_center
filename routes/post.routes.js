const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const Post = require('../models/Post');
const router = Router()
/*
    метод отдачи обращений
*/
router.get('/', auth, paginatedResults(Post), (req, res) => {
    return res.json({
        success: true,
        posts: res.paginatedResults
    });
});

/* 
    метод добавления обращения
*/
router.post('/add', auth, async (req, res, next) => {
    let fio             = req.body.fio
    let text            = req.body.text
    let selectstatus    = req.body.selectstatus
    let address         = req.body.address
    let creDate         = req.body.creDate
    let conDate         = req.body.conDate
    let regNumber       = req.body.regNumber
    let phoneNumber     = req.body.phoneNumber
    let mobileNumber    = req.body.mobileNumber
    let owner = req.user.userId
    // валидация полученныйх данных
    if (fio === undefined || text === undefined || address === undefined) {
        return res.json({
            success: false,
            message: 'Пожалуйста, заполните все поля'
        });
    } else {
        // объект нового обращения
        let newPost = new Post({
            fio,   
            text,
            selectstatus,
            address,
            creDate,
            conDate,
            regNumber,
            phoneNumber,
            mobileNumber,
            owner
        });
        // сохранение обращения
        await newPost.save().then((post) => {
            return res.json({
                success: true,
                post,
                message: 'Обращение успешно добавлено в базу данных.'
            });
        }).catch((err) => {
            return res.json({
                success: false,
                message: 'Не удалось сохранить обрашение',
                err: err
            });
        });
    }
});

/*
    метод получения обращения по ID
*/
router.get('/:id', async (req, res, next) => {
    let id = req.params.id;
    await Post.findOne({
        _id: id
    }).then((post) => {
        return res.json({
            success: true,
            post: post
        });
    }).catch((err) => {
        return res.json({
            success: false,
            message: 'Не удалось получить обращение',
            err: err
        });
    });
});

/*
    метод обновления обращения по ID
*/

router.put('/', auth, async (req, res, next) => {

    let fio = req.body.fio
    let text = req.body.text
    let selectstatus = req.body.selectstatus
    let address = req.body.address
    let creDate = req.body.creDate
    let conDate = req.body.conDate
    let regNumber = req.body.regNumber
    let phoneNumber = req.body.phoneNumber
    let mobileNumber = req.body.mobileNumber
    let owner = req.user.userId

    let id = req.body._id;

    await Post.findOne({
        _id: id
    }).then((post) => {
        post.fio = fio
        post.text = text
        post.selectstatus = selectstatus
        post.address = address
        post.creDate = creDate
        post.conDate = conDate
        post.regNumber = regNumber
        post.phoneNumber = phoneNumber
        post.mobileNumber = mobileNumber
        post.owner = owner
        post.save()
            .then((post) => {
                return res.json({
                    success: true,
                    message: 'Обращение успешно обновлено',
                    post: post
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
});
/*
    метод удаления обращения по ID
*/
router.delete('/:id', auth, (req, res, next) => {
    let id = req.params.id;
    Post.findOneAndDelete({
        _id: id
    }).then((post) => {
        return res.json({
            success: true,
            message: 'Обращение успешно удалено',
            post: post
        });
    }).catch((err) => {
        return res.json({
            success: false,
            message: 'Невозможно удалить обращение',
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
        const sortIsmain = req.query.sortIsmain
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
            if (search !== '' && search !== undefined){
                var regsearch = new RegExp("" + search + "");
                // results.results = await model.find({ $text: { $search: search}}, { score: { $meta: "textScore" } }).sort({score: {$meta: "textScore"}}).limit(limit).skip(startIndex).exec()
                if (searchparam == "fio"){
                    results.results = await model.find({ fio: { $regex: regsearch } })
                    res.paginatedResults = results
                } else if (searchparam == "mobileNumber"){
                    results.results = await model.find({ mobileNumber: { $regex: regsearch } })
                    res.paginatedResults = results
                } else if (searchparam == "phoneNumber") {
                    results.results = await model.find({ phoneNumber: { $regex: regsearch } })
                    res.paginatedResults = results
                } else if (searchparam == "address") {
                    results.results = await model.find({ address: { $regex: regsearch } })
                    res.paginatedResults = results
                } else if (searchparam == "text") {
                    results.results = await model.find({ text: { $regex: regsearch } })
                    res.paginatedResults = results
                }
                
            }else{
                /*
                    условие сортировки обращений по принадлежности к текущему пользователю
                */
                if (sortIsmain == 'main'){
                    results.results = await model.find({ owner: req.user.userId }).limit(limit).skip(startIndex).exec()
                    res.paginatedResults = results
                }else{
                    results.results = await model.find().limit(limit).skip(startIndex).exec()
                    res.paginatedResults = results
                }
            }

            next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}

module.exports = router;
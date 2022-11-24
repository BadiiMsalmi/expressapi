const router = require('express').Router()
const usersModel = require('../models/usersModels')



router.post('/register', (req, res, next) => {
    usersModel.register(req.body.username, req.body.email, req.body.password).then((doc) => {
        res.status(200).json({ doc, msg: 'user added' })
    }).catch((err) => {
        res.status(400).json({ error: err })
    })
})


router.post('/login', (req, res, next) => {
    usersModel.login(req.body.email, req.body.password).then((token) => {
        res.status(200).json({ token: token, msg: 'logged successfuly' })
    }).catch((err) => {
        res.status(400).json({ error: err })
    })
})


module.exports = router
const router = require('express').Router()
const adminModel = require('../models/adminModel')


router.post('/admin/register', (req, res, next) => {
    adminModel.registerAdmin(req.body.username, req.body.email, req.body.password).then((doc) => {
        res.status(200).json({ doc, role:'ADMIN', msg: 'added !!' })
    }).catch((err) => {
        res.status(400).json({ error: err })
    })
})


router.post('/admin/login', (req, res, next) => {
    adminModel.loginAdmin(req.body.email, req.body.password).then((token) => {
        res.status(200).json({ token: token, msg: 'logged as admin successfuly' })
    }).catch((err) => {
        res.status(400).json({ err })
    })
})


module.exports = router
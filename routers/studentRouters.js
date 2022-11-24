const router = require('express').Router()
const studentModel = require('../models/studentsModels')
const jwt = require('jsonWebToken')
require('dotenv').config()


router.get('/', (req, res, next) => {
    studentModel.testConnection().then((msg) => res.send(msg)).catch((err) => res.send(err))
})

var secretKey = process.env.PRIVATE_KEY

verifToken = (req, res, next) => {
    let token = req.headers.authorization
    if (!token) {
        res.status(400).json({ msg: 'access denied.......!!!!' })
    }
    try {
        jwt.verify(token, secretKey)
        next()
    } catch (e) {
        res.status(400).json(e)
    }
}



router.post('/addstudent', verifToken, (req, res, next) => {
    studentModel.postNewStudent(req.body.firstname, req.body.lastname, req.body.email, req.body.age, req.body.phone).then((doc) => {
        res.status(200).json(doc)
    }).catch((err) => {
        res.status(400).json({ error: err })
    })
})


router.get('/students', verifToken, (req, res, next) => {
    let token = req.headers.authorization
    let user = jwt.decode(token, { complete: true })
    studentModel.getAllStudents().then((doc) => {
        res.status(200).json({ students: doc, user: user.payload.user })
    }).catch((err) => {
        res.status(400).json(err)
    })
})

router.get('/student/:id', verifToken, (req, res, next) => {
    studentModel.getOneStudent(req.params.id).then((doc) => {
        res.status(200).json(doc)
    }).catch((err) => {
        res.status(400).json(err)
    })
})

router.delete('/student/:id', verifToken, (req, res, next) => {
    studentModel.deleteOneStudent(req.params.id).then((doc) => {
        res.status(200).json(doc)
    }).catch((err) => {
        res.status(400).json(err)
    })
})

router.patch('/student/:id', verifToken, (req, res, next) => {
    studentModel.updateOneStudent(req.params.id, req.body.firstname, req.body.lastname, req.body.age, req.body.email, req.body.phone).then((doc) => {
        res.status(200).json(doc)
    }).catch((err) => {
        res.status(400).json({ error: err })
    })
})



module.exports = router
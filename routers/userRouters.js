const router = require('express').Router()
const usersModel = require('../models/usersModels')
const jwt = require('jsonWebToken')


var secretKey = process.env.PRIVATE_KEY

//VERIFY TOKEN ADMIN START
verifyTokenAdmin = (req, res, next) => {
    let token = req.headers.authorization
    let role = req.headers.role
    if (!token || role != 'ADMIN') {
        res.status(400).json({ msg: 'access rejected (notAdmin) .....!!!!' })
    }

    try {
        jwt.verify(token,secretKey)
        next()
    } catch (e) {
        res.status(400).json({ msg: e })
    }
}
//VERIFY TOKEN ADMIN END

//VERIFY TOKEN START
verifToken = (req, res, next) => {
    let token = req.headers.authorization
    if (!token) {
        res.status(400).json({ msg: 'access denied (not user).......!!!!' })
    }
    try {
        jwt.verify(token,secretKey)
        next()
    } catch (e) {
        res.status(400).json(e)
    }
}
//VERIFY TOKEN END

router.post('/register', (req, res, next) => {
    usersModel.register(req.body.username, req.body.email, req.body.age,req.body.phone,req.body.password).then((doc) => {
        res.status(200).json({ doc:doc, msg: 'user added' })
    }).catch((err) => {
        res.status(400).json({ error: err })
    })
})


router.post('/login', (req, res, next) => {
    usersModel.login(req.body.email, req.body.password).then((token) => {
        res.status(200).json({ token: token, msg: 'logged successfuly' })
    }).catch((err) => {
        res.status(400).json({ err })
    })
})


// GET ALL USERS
router.get('/users',verifyTokenAdmin, (req, res, next) => {
    usersModel.getAllUsers().then((doc) => {
        res.status(200).json(doc)
    }).catch((err) => {
        res.status(400).json(err)
    })
})

// GET ONE PRODUCT BY ID
router.get('/user/:id',verifToken,  (req, res, next) => {
    usersModel.getOneUser(req.params.id).then((doc) => {
        res.status(200).json(doc)
    }).catch((err) => {
        res.status(400).json(err)
    })
})

// DELETE ONE USER
router.delete('/user/:id',verifToken, (req, res, next) => {
    usersModel.deleteOneUser(req.params.id).then((doc) => {
        res.status(200).json(doc)
    }).catch((err) => {
        res.status(400).json(err)
    })
})


module.exports = router
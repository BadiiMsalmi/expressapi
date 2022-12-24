const router = require('express').Router()
const productModel = require('../models/productModel')
const jwt = require('jsonWebToken')
require('dotenv').config()
const multer = require('multer')

var secretKey = process.env.PRIVATE_KEY

//VERIFY TOKEN START
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
//VERIFY TOKEN END

//VERIFY TOKEN ADMIN START
verifyTokenAdmin = (req, res, next) => {
    let token = req.headers.authorization
    let role = req.headers.role
    if (!token || role != 'ADMIN') {
        res.status(400).json({ msg: 'access rejected.....!!!' })
    }

    try {
        jwt.verify(token, secretKey)
        next()
    } catch (e) {
        res.status(400).json({ msg: e })
    }
}
//VERIFY TOKEN ADMIN END

// ADD NEW PRODUCT
router.post('/addproduct',multer({
    storage:multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,'assets/images')
        },
        filename:function(res,file,cb){
            cb(null,Date.now() +'-'+ file.originalname)  
            console.log(file) 
        }   
    })
}).single('productPhoto'),verifToken, (req, res, next) => {
    productModel.postNewProduct(req.body.productName, req.body.productDesc, req.body.productState, req.file.filename).then((doc) => {
        res.status(200).json(doc)
    }).catch((err) => {
        res.status(400).json({ error: err })
    })
})

// GET ONE PRODUCT BY ID
router.get('/product/:id',verifToken,  (req, res, next) => {
    productModel.getOneProduct(req.params.id).then((doc) => {
        res.status(200).json(doc)
    }).catch((err) => {
        res.status(400).json(err)
    })
})

// GET ALL PRODUCT
router.get('/products',verifToken,(req, res, next) => {
    productModel.getAllProducts().then((doc) => {
        res.status(200).json(doc)
    }).catch((err) => {
        res.status(400).json(err)
    })
})

// DELETE ONE PRODUCT
router.delete('/product/:id',verifToken, (req, res, next) => {
    productModel.deleteOneProduct(req.params.id).then((doc) => {
        res.status(200).json(doc)
    }).catch((err) => {
        res.status(400).json(err)
    })
})

module.exports = router


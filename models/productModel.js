const mongoose = require('mongoose')
const Joi = require('joi')
require('dotenv').config()

const schemaValidate = Joi.object({
    productName: Joi.string().alphanum().min(3).max(30).required(),
    productDesc: Joi.string().min(3).max(100).required(),
    productState: Joi.string().required()
})

let schemaProduct = mongoose.Schema({
    productName: String,
    productDesc: String,
    productState: String,
    productimage: String

})


var Product = mongoose.model('product', schemaProduct)
var url = process.env.URL

exports.postNewProduct = (productName, productDesc, productState, filename) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {                  //, { useNewUrlParser: true, useUnifiedTopology: true }  
            let validation = await schemaValidate.validateAsync ({
                productName: productName,
                productDesc: productDesc,
                productState: productState
            })
            if (validation.error) {
                mongoose.disconnect()
                reject(validation.error.details[0].message)
            }
            let product = new Product({
                productName: productName,
                productDesc: productDesc,
                productState: productState,
                productimage: filename
            })
            product.save().then((doc) => {
                mongoose.disconnect()
                resolve('added !!')
            }).catch((err) => {
                mongoose.disconnect()
                reject('error while saving ')
            })
        }).catch((err) => reject(err))
    })
}


exports.getAllProducts = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Product.find()
        }).then((doc) => {
            mongoose.disconnect()
            resolve(doc)
        }).catch((err) => {
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.getOneProduct = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Product.findById(id)
        }).then((doc) => {
            mongoose.disconnect()
            resolve(doc)
        }).catch((err) => {
            mongoose.disconnect()
            reject(err)
        })
    })
}


exports.deleteOneProduct = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Product.deleteOne({ _id: id })
        }).then((doc) => {
            mongoose.disconnect()
            resolve(doc)
        }).catch((err) => {
            mongoose.disconnect()
            reject(err)
        })
    })
}
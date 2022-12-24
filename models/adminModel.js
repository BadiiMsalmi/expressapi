const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
require('dotenv').config()

const schemaValidation = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr'] } }).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
})

let schemaUser = mongoose.Schema({
    username: String,
    email: String,
    password: String
})

let url = process.env.URL


var Admin = mongoose.model('Admin', schemaUser)

exports.registerAdmin = (username, email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Admin.findOne({ email: email })
        }).then((doc) => {
            if (doc) {
                mongoose.disconnect()
                reject('Email is already used.')
            } else {
                bcrypt.hash(password, 10).then((hashedPass) => {
                    let user = new Admin({
                        username: username,
                        email: email,
                        password: hashedPass
                    })
                    user.save().then((doc) => {
                        mongoose.disconnect()
                        resolve(doc)
                    }).catch((err)=>{
                        mongoose.disconnect()
                        reject('here')
                    })
                }).catch((err) => {
                    mongoose.disconnect()
                    reject('error in saving ')
                })
            }
        })
    })
}

var secretKey = process.env.PRIVATE_KEY

exports.loginAdmin = (email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Admin.findOne({ email: email })
        }).then((user) => {
            if (!user) {
                mongoose.disconnect()
                reject('Invalid informations.')
            } else {
                bcrypt.compare(password, user.password).then((same) => {
                    if (same) {
                        let token = jwt.sign({ id: user._id, username: user.username,email : user.email,role :'ADMIN' }, secretKey, { expiresIn: '1h' })
                        mongoose.disconnect()
                        resolve({ token: token, role: 'ADMIN',username:user.username})
                    } else {
                        mongoose.disconnect()
                        reject('Invalid informations.')
                    }
                }).catch((err) => {
                    mongoose.disconnect()
                    reject(err)
                })
            }
        })
    })
}
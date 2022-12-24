const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
require('dotenv').config()

const schemaValidation = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr'] } }).required(),
    age:Joi.number().required(),
    phone:Joi.number().min(8).max(8).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
})

let schemaUser = mongoose.Schema({
    username: String,
    email: String,
    age:Number,
    phone:Number,
    password: String
})


let url = process.env.URL


var User = mongoose.model('user', schemaUser)


exports.register = (username, email,age, password,phone) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return User.findOne({ email: email })
        }).then((doc) => {
            if (doc) {
                mongoose.disconnect()
                reject('Email is already used.')
            } else {
                bcrypt.hash(password, 5).then(async (hashedPass) => {
                    let validation = await schemaValidation.validateAsync({
                        username: username,
                        email: email,
                        age:age,
                        phone:phone,
                        password: password
                    })
                    if (validation.error) {
                        mongoose.disconnect()
                        reject(validation.error.details[0].message)
                    }
                    let user = new User({
                        username: username,
                        email: email,
                        age:age,
                        phone:phone,
                        password: hashedPass
                    })
                    user.save().then((doc) => {
                        mongoose.disconnect()
                        resolve(doc)
                    }).catch((err) => {
                        mongoose.disconnect()
                        reject(err)
                    })
                }).catch((err) => {
                    mongoose.disconnect()
                    reject(err)
                })
            }
        })
    })
}

var secretKey = process.env.PRIVATE_KEY

exports.login = (email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return User.findOne({ email: email })
        }).then((user) => {
            if (!user) {
                mongoose.disconnect()
                reject('Invalid informations.')
            } else {
                bcrypt.compare(password, user.password).then((same) => {
                    if (same) {
                        let token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' })
                        mongoose.disconnect()
                        resolve(token)
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


exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return User.find()
        }).then((doc) => {
            mongoose.disconnect()
            resolve(doc)
        }).catch((err) => {
            mongoose.disconnect()
            reject(err)
        })
    })
}


exports.getOneUser = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return User.findById(id)
        }).then((doc) => {
            mongoose.disconnect()
            resolve(doc)
        }).catch((err) => {
            mongoose.disconnect()
            reject(err)
        })
    })
}


exports.deleteOneUser = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return User.deleteOne({ _id: id })
        }).then((doc) => {
            mongoose.disconnect()
            resolve(doc)
        }).catch((err) => {
            mongoose.disconnect()
            reject(err)
        })
    })
}

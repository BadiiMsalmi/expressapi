const mongoose = require('mongoose')
const Joi = require('joi')
require('dotenv').config()

const schemaValidation = Joi.object({
    firstname: Joi.string().alphanum().min(3).max(30).required(),
    lastname: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr'] } }).required(),
    age: Joi.number().required(),
    phone: Joi.number().required()
})

let schemaStudent = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    age: Number,
    phone: Number
})

var Student = mongoose.model('student', schemaStudent)
var url = process.env.URL


exports.testConnection = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {                  //, { useNewUrlParser: true, useUnifiedTopology: true }   
            mongoose.disconnect()
            resolve('connected')
        }).catch((err) => reject(err))
    })
}


exports.postNewStudent = (firstname, lastname, email, age, phone) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {                  //, { useNewUrlParser: true, useUnifiedTopology: true }  
            let validation = await schemaValidation.validateAsync({
                firstname: firstname,
                lastname: lastname,
                email: email,
                age: age,
                phone: phone
            })
            if (validation.error) {
                mongoose.disconnect()
                reject(validation.error.details[0].message)
            }
            let student = new Student({
                firstname: firstname,
                lastname: lastname,
                email: email,
                age: age,
                phone: phone
            })
            student.save().then((doc) => {
                mongoose.disconnect()
                resolve(doc)
            }).catch((err) => {
                mongoose.disconnect()
                reject('error while saving ')
            })
        }).catch((err) => reject('error while connecting to database'))
    })
}


exports.getAllStudents = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Student.find()
        }).then((doc) => {
            mongoose.disconnect()
            resolve(doc)
        }).catch((err) => {
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.getOneStudent = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Student.findById(id)
        }).then((doc) => {
            mongoose.disconnect()
            resolve(doc)
        }).catch((err) => {
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.deleteOneStudent = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            return Student.deleteOne({ _id: id })
        }).then((doc) => {
            mongoose.disconnect()
            resolve(doc)
        }).catch((err) => {
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.updateOneStudent = (id, firstname, lastname, age, email, phone) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            let validation = schemaValidation.validate({
                firstname: firstname,
                lastname: lastname,
                email: email,
                age: age,
                phone: phone
            })
            if (validation.error) {
                mongoose.disconnect()
                reject(validation.error.details[0].message)
            }
            return Student.updateOne({ _id: id }, { firstname: firstname, lastname: lastname, age: age, phone: phone, email: email })
        }).then((doc) => {
            mongoose.disconnect()
            resolve(doc)
        }).catch((err) => {
            mongoose.disconnect()
            reject(err)
        })
    })
}
const express = require('express')
const studentRoute = require('./routers/studentRouters')
const usersRoute = require('./routers/userRouters')
const app = express()
require('dotenv').config()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*")
    res.setHeader('Access-Control-Request-Method', "*")
    res.setHeader('Access-Control-Allow-Headers', "authorization")
    next()
})

app.use('/', studentRoute)
app.use('/', usersRoute)


app.listen(3000, () => console.log('server running on port 3000'))
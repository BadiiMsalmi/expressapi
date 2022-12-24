const express = require('express')
const usersRoute = require('./routers/userRouters')
const adminRoute = require('./routers/adminRouters')
const productRoute = require('./routers/productRouter')
const app = express()
require('dotenv').config()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*")
    res.setHeader('Access-Control-Request-Methods', "*")
    res.setHeader('Access-Control-Allow-Headers', "*")
    res.setHeader('Access-Control-Allow-Methods', "*")
    next()
})

app.use('/', usersRoute)
app.use('/',adminRoute)
app.use('/',productRoute)


app.listen(3000, () => console.log('server running on port 3000'))
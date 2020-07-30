const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
// const multer = require('multer')

const MONGO_URI = 'mongodb+srv://brian:Xh3xfglahEAIf3tV@cluster0-vv8md.mongodb.net/tripleNCapital'

const feedRoutes = require('./routes/feed')
const authRoutes = require('./routes/auth')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    next()
})

app.use('/feeds', feedRoutes)
app.use('/auth', authRoutes)


app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    const data = error.data 
    res.status(status).json({ message: message, data: data })
})

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(result => {
    app.listen(4000)
    console.log('It is up...')
}).catch(err => console.log(err))

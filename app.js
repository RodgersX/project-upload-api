const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')

const MONGO_URI = 'mongodb+srv://brian:Xh3xfglahEAIf3tV@cluster0-vv8md.mongodb.net/tripleNCapital'

const feedRoutes = require('./routes/feed')
const projectRoutes = require('./routes/project')
const authRoutes = require('./routes/auth')

const app = express()

app.use(bodyParser.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    next()
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'))

app.use('/feeds', feedRoutes)
app.use('/auth', authRoutes)
app.use('/projects', projectRoutes)


app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    const data = error.data 
    res.status(status).json({ message: message, data: data })
})

mongoose.connect(MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(result => {
    app.listen(4000)
    console.log('It is up...')
}).catch(err => console.log(err))
const express = require('express')
const { body } = require('express-validator/check')

const feedController = require('../controllers/feed')

const router = express.Router()

router.get('/feed', feedController.getFeeds)

router.post('/add-feed',[
    body('title').trim().isLength({ min: 5 }),
    body('description').trim().isLength({ min: 5 })
], feedController.createFeed)

router.get('/feed/:feedId', feedController.getFeed)

router.put('/feed/:feedId', [
    body('title').trim().isLength({ min: 5 }),
    body('description').trim().isLength({ min: 5 })
], feedController.updateFeed)

router.delete('/feed/:feedId', feedController.deleteFeed)

module.exports = router
const { validationResult } = require('express-validator/check')

const Feed = require('../models/feed')


exports.getFeeds = (req, res, next) => {
    Feed.find().then(feeds => {
        res.status(200).json({ message: 'fetched feeds successfully', feeds: feeds })
    }).catch(err => {
         if(!err.statusCode) {
            err.statusCode = 500
         }
         next(err)
    })
}

exports.createFeed = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        const error = new Error('validation failed')
        error.statusCode = 422
        throw error
    }

    const title = req.body.title
    const description = req.body.description
    const image = req.file

    if(!image) {
        return res.status(401).json({ message: 'Attached file is not an image' })
    }
    const imageUrl = image.path

    const feed = new Feed({
        title: title,
        description: description,
        image: imageUrl
    })
    feed.save().then(result => {
        res.status(201).json({
            message: 'Feed created successfully',
            feed: result
        })
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
}

exports.getFeed = (req, res, next) => {
    const feedId = req.params.feedId
    Feed.findById(feedId).then(feed => {
        if(!feed) {
            const error = new Error('Could not find feed')
            error.statusCode = 404
            throw error
        }
        res.status(200).json({ message: 'Feed fetched', feed: feed})
    }).catch( err => {
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
}

exports.updateFeed = (req, res, next) => {
    const feedId = req.params.feedId
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        const error = new Error('validation failed')
        error.statusCode = 422
        throw error
    }

    const title = req.body.title
    const description = req.body.description

    Feed.findById(feedId)
        .then(feed => {
            if(!feed) {
                const error = new Error('Could not find feed')
                error.statusCode = 404
                throw error
            }
            feed.title = title
            feed.description = description
            return feed.save()
        }).then(result => {
            res.status(200).json({ message: 'Feed updated!', feed: result })
        }).catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

exports.deleteFeed = (req, res, next) => {
    const feedId = req.params.feedId
    Feed.findById(feedId)
        .then(feed => {
            if(!feed) {
                const error = new Error('Could not find feed')
                error.statusCode = 404
                throw error
            }
            // check logged in user
            return Feed.findByIdAndRemove(feedId)
        }).then(result => {
            console.log(result)
            res.status(200).json({ message: 'Deleted feed' })
        }).catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}
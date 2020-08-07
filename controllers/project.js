const { validationResult } = require('express-validator/check')

const Project = require('../models/project')

exports.allProjects = (req, res, next) => {
    Project.find().then(projects => {
        res.status(201).json({ projects: projects })
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
}

exports.addProject = (req, res, next) => {
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

    const project = new Project({
        title: title,
        description: description,
        image: imageUrl
    })
    project.save().then(result => {
        res.status(201).json({
            message: 'project created successfully',
            project: result
        })
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
}

exports.deleteProject = (req, res, next) => {
    const projectId = req.params.projectId

    Project.findById(projectId).then(project => {
        if(!project) {
            const error = new Error('Could not find project')
            error.statusCode = 404
            throw error
        }
        return Project.findByIdAndRemove(projectId)
    }).then(result => {
        console.log(result)
        res.status(200).json({ message: 'Project deleted!' })
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    })
}


const express = require('express')
const { body } = require('express-validator/check')

const projectController = require('../controllers/project')

const router = express.Router()

router.get('/project', projectController.allProjects)

router.post('/add-project', [
    body('title').trim().isLength({ min: 5 }),
    body('description').trim().isLength({ min: 5 })
], projectController.addProject)

router.delete('/project/:projectId', projectController.deleteProject)

module.exports = router
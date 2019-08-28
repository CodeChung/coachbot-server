const express = require('express');
const LogsService = require('./logs-service');
const requireAuth = require('../middleware/jwt-auth');

const logsRouter = express.Router()
const jsonBodyParser = express.json()

logsRouter
    .route('/:goalId')
    .all(requireAuth)
    .get((req, res, next) => {
        const userId = req.user.id

    })

logsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const userId = req.user.id
        const goalId = 1

        LogsService.getDailyRatings(req.app.get('db'), goalId)
            .then(res => console.log(res))
    })

module.exports = logsRouter
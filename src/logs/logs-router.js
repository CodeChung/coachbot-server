const express = require('express');
const LogsService = require('./logs-service');
const requireAuth = require('../middleware/jwt-auth');

const logsRouter = express.Router()
const jsonBodyParser = express.json()

logsRouter
    .route('/daily/:goalId')
    .all(requireAuth)
    .get((req, res, next) => {
        const userId = req.user.id
        const { goalId } = req.params

        LogsService.getDailyRatings(req.app.get('db'), goalId)
        .then(ratings => {
            if (!ratings.length) {
                return res.status(404).json({
                    error: 'Ratings not found'
                })
            }
            res.status(200).json({
                data: ratings
            })
        })
    })

logsRouter
    .route('/weekly/:goalId')
    .all(requireAuth)
    .get((req, res, next) => {
        const userId = req.user.id
        const { goalId } = req.params

        LogsService.getWeeklyRatings(req.app.get('db'), goalId)
            .then(ratings => {
                if (!ratings.length) {
                    return res.status(404).json({
                        error: 'Ratings not found'
                    })
                }
                res.status(200).json({
                    data:ratings
                })
            })
    })

logsRouter
    .route('/stats/:goalId')
    .all(requireAuth)
    .get((req, res, next) => {
        const userId = req.user.id
        const { goalId } = req.params

        LogsService.getGoalStats(req.app.get('db'), goalId)
            .then(stats => {
                if (!Object.keys(stats).length) {
                    return res.status(404).json({
                        error: 'No stats available'
                    })
                }
                res.status(200).json(stats)
            })
    })

logsRouter
    .route('/:goalId')
    .all(requireAuth)
    .get((req, res, next) => {
        const userId = req.user.id
        const { goalId } = req.params
        
        LogsService.getAllUserLogs(req.app.get('db'), goalId)
    })

module.exports = logsRouter
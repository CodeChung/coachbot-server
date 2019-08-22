const express = require('express');
const path = require('path');
const GoalsService = require('./goals-service');
const requireAuth = require('../middleware/jwt-auth');

const goalsRouter = express.Router()
const jsonBodyParser = express.json()

goalsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const userId = req.user.id
        GoalsService.getAllGoals(req.app.get('db'), userId)
            .then(goals => {
                res.status(200).json(goals)
            })
            .catch(next)
    })
    .post(jsonBodyParser, (req, res) => {
        const user_id = req.user.id
        const { title, schedule, duration, } = req.body
        const newGoal = { user_id, title, schedule, duration, }

        GoalsService.insertGoal(req.app.get('db'), newGoal)
    })
    
module.exports = goalsRouter
const express = require('express');
const path = require('path');
const GoalsService = require('./goals-service');
const requireAuth = require('../middleware/jwt-auth');
const dialogflow = require('dialogflow')
const uuid = require('uuid');

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
            .then(goals => {
                res.status(201).json(goals)
            })
    })

goalsRouter
    .route('/:goalId')
    .all(requireAuth)
    .get((req, res, next) => {
        const goalId = req.params.goalId
        GoalsService.getGoalById(req.app.get('db'), goalId)
            .then(goal => {
                if (!goal.length) {
                    return res.status(404)
                        .json({ error: 'Goal not found' })
                }
                res.status(200).json(goal)
                // // Here we store a dialogflow session for the specific goal
                // TODO FIX: session doesn't persist between calls 
                if (!req.session[`session-${goalId}`]) {
                    const sessionClient = new dialogflow.SessionsClient({
                        keyFilename: '../../coachbot-f3df93d5ee22.json'
                    });
                    const sessionId = uuid.v4();
                    req.session[`session-${goalId}`] = { sessionClient, sessionId }
                    // console.log(req.session[`session-${goalId}`], 'SESSSSSSSSION!!!')
                }
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        const goalId = req.params.goalId
        GoalsService.deleteGoal(req.app.get('db'), goalId)
            .then(goalDeleted => {
                if (!goalDeleted) {
                    return res.status(401)
                        .json({ error: 'Unable to delete goal, try again'})
                }
                res.status(201)
            })
    })
    
module.exports = goalsRouter
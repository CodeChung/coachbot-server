const express = require('express');
const path = require('path');
const dialogflow = require('dialogflow')
const uuid = require('uuid')
const CoachService = require('./coach-service');
const requireAuth = require('../middleware/jwt-auth');
const goalCache = require('../middleware/session-handler');

const coachRouter = express.Router()
const jsonBodyParser = express.json()

coachRouter
    .route('/:goalId')
    .all(requireAuth)
    .post(jsonBodyParser, async (req, res, next) => {
        console.log('RUNNING')
        const { goalId } = req.params
        const { msg } = req.body
        
        // currently gives name of user
        CoachService.sendClientToDialogflow(req.user.id, goalId, msg)
            .then(msg => console.log(msg))
    })
    
    // i want to check if user checked in, i want to check if new user, i want to check how many practices missed, i want to 
    // i want to the bot to motivate me, remind me why i'm doing this, 

coachRouter
    .route('/new/:goalId')
    .all(requireAuth)
    .get(async (req, res, next) => {
        const { goalId } = req.params
        const messages = await CoachService.getNewChat(
                req.app.get('db'),
                goalId,
                req.user.id
            )
        console.log(messages)
        res.status(200).json(
            messages
        )
    })
module.exports = coachRouter
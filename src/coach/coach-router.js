const express = require('express');
const path = require('path');
const CoachService = require('./coach-service');
const requireAuth = require('../middleware/jwt-auth');

const coachRouter = express.Router()
const jsonBodyParser = express.json()

coachRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        // CoachService.wit()
        //     .then(msg => res.send(msg))
        CoachService.name(req.app.get('db'), req.user.id)
        .then(name => res.send(name))
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
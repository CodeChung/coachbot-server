const express = require('express');
const path = require('path');
const dialogflow = require('dialogflow')
const uuid = require('uuid')
const requireAuth = require('../middleware/jwt-auth');
const goalCache = require('../middleware/session-handler');
const sendMsgToDialogflow = require('../dialogflow/dialogflow-service');
const ChatService = require('./chat-service');

const chatRouter = express.Router()
const jsonBodyParser = express.json()

chatRouter
    .route('/:goalId')
    .all(requireAuth)
    .post(jsonBodyParser, async (req, res, next) => {
        console.log('RUNNING')
        const { goalId } = req.params
        const { msg } = req.body
        // here we're sending client message to dialogflow and storing both responses in messages table
        try {
            const userId = req.user.id
            const dialogflowMessage = await sendMsgToDialogflow(req.app.get('db'), req.user.id, goalId, msg)
            
            await ChatService.saveMsg(req.app.get('db'), userId, goalId, msg)
            await ChatService.saveMsg(req.app.get('db'), 0, goalId, dialogflowMessage)
            res.status(201).json({ msg: dialogflowMessage })
        } catch (error) {
            res.status(500).json({ error })
        }
    })
    .get((req, res, next) => {
        const { goalId } = req.params
        
        ChatService.getConversation(req.app.get('db'), goalId)
            .then(conversation => {
                if (!conversation) {
                    return res.status(500).json({ error: 'Internal Server Error'})
                }
                return res.status(200).json(conversation)
            })
    })
    
    // i want to check if user checked in, i want to check if new user, i want to check how many practices missed, i want to 
    // i want to the bot to motivate me, remind me why i'm doing this, 

module.exports = chatRouter
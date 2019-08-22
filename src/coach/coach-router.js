const express = require('express');
const path = require('path');
const CoachService = require('./coach-service');

const coachRouter = express.Router()
const jsonBodyParser = express.json()

coachRouter
    .route('/')
    .post()
    
module.exports = coachRouter
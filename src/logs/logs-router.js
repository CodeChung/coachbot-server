const express = require('express');
const LogsService = require('./logs-service');
const requireAuth = require('../middleware/jwt-auth');

const logsRouter = express.Router()
const jsonBodyParser = express.json()
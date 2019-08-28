const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const goalCache = require('./middleware/session-handler')
const { NODE_ENV } = require('./config')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')
const goalsRouter = require('./goals/goals-router')
const chatRouter = require('./chat/chat-router')
const logsRouter = require('./logs/logs-router')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}))
app.use(cors())
app.use(helmet())

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/goals', goalsRouter)
app.use('/api/chat', chatRouter)
app.use('/api/logs', logsRouter)


app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: 'server error' }
  } else {
    console.error(error)
    response = { error: error.message, details: error }
  }
  res.status(500).json(response)
})

module.exports = app

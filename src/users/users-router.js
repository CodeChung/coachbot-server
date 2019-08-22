const express = require('express');
const path = require('path');
const UsersService = require('./users-service');

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .route('/')
    .post(jsonBodyParser, (req, res, next) => {
        const { name, username, password } = req.body;
        
        for (const field of ['name', 'username', 'password']) {
            if (!req.body[field]) {
                return res.status(400).json({ 
                    error: `Missing ${field} in request body`
                })
            }
        }
        
        const passwordError = UsersService.validatePassword(password)
        if (passwordError) {
            return res.status(400).json({
                error: passwordError
            })
        }

        UsersService.hasUserWithUsername(
            req.app.get('db'),
            username
        )
            .then(usernameTaken => {
                if (usernameTaken) {
                    return res.status(400).json({
                        error: 'Username already taken'
                    })
                }

                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        // question: why not serialize before 
                        const newUser = {
                            username,
                            password: hashedPassword,
                            name,
                        }

                        return UsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                res.status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UsersService.serializeUser(user))
                            })
                    })
            })
    })

module.exports = usersRouter
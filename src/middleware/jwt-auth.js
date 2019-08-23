const AuthService = require('../auth/auth-service');

function requireAuth(req, res, next) {
    const authToken = req.get('Authorization') || ''

    let bearerToken
    if (!authToken.toLowerCase().startsWith('bearer ')) {
        return res.status(401).json({ error: 'Missing bearer token'})
    } else {
        bearerToken = authToken.slice(7, authToken.length)
    }

    const payload = AuthService.verifyJWT(bearerToken)

    AuthService.getUserByUsername(
        req.app.get('db'),
        payload.sub
    )
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized request' })
            }

            // pass user to next middleware
            req.user = user
            next()
        })
        .catch(err => {
            console.error(err)
            next(err)
        })
}

module.exports = requireAuth;
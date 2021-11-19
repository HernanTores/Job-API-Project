const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Invalid authentication')
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        //req.user = User.findById(payload.id).select('-password')

        req.user = {userID: payload.id, name: payload.name}
        next()
    } catch (error) {
        throw new UnauthenticatedError('Invalid authetication')
    }
}

module.exports = auth
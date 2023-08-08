const jwt = require('jsonwebtoken')

const verifyJWTBuyer = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized'})
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            req.buyerId  = decoded.UserInfo.buyerId
            req.userType = decoded.UserInfo.userType
            next()
        }
    )
}

module.exports = verifyJWTBuyer
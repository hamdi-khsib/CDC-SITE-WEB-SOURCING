const bcrypt = require("bcrypt")
const jwt =require("jsonwebtoken")
const Supplier = require("../models/Supplier.js")
const asyncHandler = require("express-async-handler")
const { response } = require("express")

/* register supplier */

const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            address,
            contact,
            domain,
            products,
            prices,
            userType
        } = req.body

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt)

        const newSupplier = new Supplier({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            address,
            contact,
            domain,
            products,
            prices,
            userType
        })

        const savedSupplier = await newSupplier.save()
        res.status(201).json(savedSupplier)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


// @desc login
// @route POST /auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).jsonn({message: 'All fields are required'})
    }

    const foundSupplier = await Supplier.findOne({ username }).exec()

    if (!foundSupplier) {
        return res.status(401).json({ message: 'Unauthorized'})
    }

    const match = await bcrypt.compare(password, foundSupplier.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized'})

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundSupplier.username,
                "userType": foundSupplier.userType
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m'}
    )

    const refreshToken = jwt.sign(
        {
            "username": foundSupplier.username
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d'}
    )

    // create secure cookie with refresh token
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: 'None', //croos-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match
    })

    // Send accessToken containing username and userType
    res.json({ accessToken })
})

// @desc refresh
// @route GET /auth/refresh
// @access Public
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized'})

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundSupplier = await Supplier.findOne({ username: decoded.username }).exec()

            if (!foundSupplier) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundSupplier.username,
                        "userType": foundSupplier.userType
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        })
    )

}


// @desc logout
// @route POST /auth/logout
// @access Public
const logout = (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204)
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None'
    , secure: true})
    res.json({ message: 'Cookie cleared'})
}

module.exports = {
    register,
    login,
    refresh,
    logout
}

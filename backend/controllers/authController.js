const bcrypt = require("bcrypt")
const crypto = require('crypto')
const jwt =require("jsonwebtoken")
const Supplier = require("../models/Supplier.js")
const asyncHandler = require("express-async-handler")
const transporter = require('../config/mailer')

/* register supplier */

function generateConfirmationToken() {
    const token = crypto.randomBytes(32).toString('hex');
    return token;
}

const register = asyncHandler (async (req,res) => {
    const {
        username,
        email,
        password,
        address,
        contact,
        domain,
        products,
        prices,
        userType
    } = req.body
    
    // confirm data
    if (!username || !email || !address || !contact || !domain || !products || !prices || !password || !Array.isArray(userType) || !userType.length) {
        return res.status(400).json({ message
            :'All fields are required' })
    }

    // check for duplicate 
    const duplicate = await Supplier.findOne({ username }).lean().exec()
    if (duplicate) {
        return res.status(400).json({ message:'Duplicate firstname' })
    }

    //Hash password

    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const supplierObject = {
        username,
        email,
        password: hashedPwd,
        address,
        contact,
        domain,
        products,
        prices,
        userType
    }

const supplier = await Supplier.create(supplierObject)

    if (supplier) {
        res.status(201).json({ message: `New supplier ${username} created`})
        const confirmationToken = generateConfirmationToken();
        const confirmationLink = `http://localhost:8000/auth/confirm?token=${confirmationToken}`;
        console.log('Recipient email:', supplier.email);
        const mailOptions = {
            from: 'khsib.hamdi@esprit.tn',
            to: supplier.email,
            subject: 'Confirm Your Email',
            html: `<p>Click <a href="${confirmationLink}">here</a> to confirm your email.</p>`,
        }
        console.log(mailOptions)
        try {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending confirmation email:', error);
            } else {
                console.log('Confirmation email sent:', info.response);
            }
        });
        } catch(error) {
            console.error('Error in sending email:', error);
    res.status(500).json({ error: 'An error occurred while sending the email.' });
        }
    } else {
        res.status(400).json({ message: 'Invalid supplier data received'})
    } 
    
})

const validateConfirmationToken = (receivedToken, generatedToken) => {
    return receivedToken === generatedToken;
};
    


const confirmMail = asyncHandler(async(req, res) => {

    const token = req.query.token;

    const isValidToken = validateConfirmationToken(token, generateConfirmationToken());

    if (isValidToken) {
        if (supplier) {
            try {
            
                res.status(200).json({ message: 'Email confirmed successfully!'})
            } catch (error) {
                console.error('Error sending confirmation email:', error)
                res.status(500).json({ error: 'An error occurred while sending the confirmation email'})
            }
        } else {
            res.status(404).json({ message: 'Supplier not found'})
        }
    } else {
        res.status(400).json({ message: 'Invalid confirmation token'})
    }

})


// @desc login
// @route POST /auth/login
// @access Public
const login = asyncHandler(async(req, res) => {
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
    logout,
    confirmMail
}

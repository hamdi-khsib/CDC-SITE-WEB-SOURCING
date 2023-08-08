const express = require("express");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Buyer = require('./models/Buyer'); 
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const buyerRoutes = require("./routes/buyerRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const multer = require ("multer");
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logger')
const { logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require('./config/dbConn')
const cookieParser = require('cookie-parser')
const bcrypt = require("bcrypt")


const PORT = process.env.PORT || 8000

const app = express()

app.use(
    session({
        secret: require('crypto').randomBytes(64).toString('hex'),
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

dotenv.config()

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(helmet())

app.use(helmet.crossOriginResourcePolicy({ policy : "cross-origin" }))

app.use(morgan("common"))

app.use(bodyParser.json( { limit: "30mb", extended: true}))

app.use(bodyParser.urlencoded( { limit: "30mb", extended: true}))

app.use(cookieParser())


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })



/* Routes */
app.use('/', express.static(path.join(__dirname, '/public')))

app.use('/', require('./routes/root'))
app.use("/auth", authRoutes)
app.use('/suppliers', supplierRoutes)
app.use("/buyers", buyerRoutes)
app.use("/ratings", ratingRoutes)

app.all('*', (req,res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))

    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found'})
    } else {
        res.type('txt').send('404 Not Found')
    }
})

passport.use('local',
    new LocalStrategy(
        {
            usernameField: 'username', 
            passwordField: 'password'
        },
        async (username, password, done) => {
            try {
                const buyer = await Buyer.findOne({ username });
                if (!buyer) {
                    return done(null, false, console.log('Incorrect username' ));
                }
                const match = await bcrypt.compare(password, buyer.password)
                if (!match) {
                    return done(null, false, console.log('Incorrect password' ));
                }
                return done(null, buyer);
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((buyer, done) => {
    done(null, buyer.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const buyer = await Buyer.findById(id);
        done(null, buyer);
    } catch (error) {
        done(error);
    }
});



app.use(errorHandler)


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
const express = require ("express");
const cors = require ("cors");
const helmet = require ("helmet");
const bodyParser = require ("body-parser");
const morgan = require ("morgan");
const path = require ("path");
const authRoutes = require ("./routes/authRoutes");
const supplierRoutes = require ("./routes/supplierRoutes");
const buyerRoutes = require ("./routes/buyerRoutes");
const multer = require ("multer");
const { register } = require ("./controllers/authController");
const corsOptions = require('./config/corsOptions')
const { logger } = require ('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const mongoose = require ("mongoose");
const dotenv = require ("dotenv");



const PORT = process.env.PORT || 8000

const app = express()

dotenv.config()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(helmet())

app.use(helmet.crossOriginResourcePolicy({ policy : "cross-origin" }))

app.use(morgan("common"))

app.use(bodyParser.json( { limit: "30mb", extended: true}))

app.use(bodyParser.urlencoded( { limit: "30mb", extended: true}))

app.use(errorHandler)

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

  })
  .catch((error) => console.log(`${error} did not connect`));




/* Routes with files */
app.post("/auth/register", upload.single("picture"), register)

/* Routes */
app.use("/auth", authRoutes)
app.use("/suppliers", supplierRoutes)
app.use("/buyers", buyerRoutes)

import express from "express"
import cors from "cors"
import helmet from "helmet"
import bodyParser from "body-parser"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import authRoutes from "./routes/authRoutes.js"
import multer from "multer"
import { register } from "./controllers/authController.js"
import supplierRoutes from "./routes/supplierRoutes.js"
import buyerRoutes from "./routes/buyerRoutes.js"
const corsOptions = require('./config/corsOptions')
const { logger } = require ('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')


const __filename= fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(helmet())

app.use(helmet.crossOriginResourcePolicy({ policy : "cross-origin" }))

app.use(morgan("common"))

app.use(bodyParser.json( { limit: "30mb", extended: true}))

app.use(bodyParser.urlencoded( { limit: "30mb", extended: true}))

app.use("/assets", express.static(path.join(__dirname, 'public/assets')))

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



/* Routes with files */
app.post("/auth/register", upload.single("picture"), register)

/* Routes */
app.use("/auth", authRoutes)
app.use("/suppliers", supplierRoutes)
app.use("/buyers", buyerRoutes)

export default app
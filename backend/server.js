import express from "express"
import cors from "cors"
import helmet from "helmet"
import bodyParser from "body-parser"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import authRoutes from "./routes.auth.js"
import multer from "multer"
import { register } from "./controllers/auth.js"
import supplierRoutes from "./routes/suppliers.js"
/* import restaurants from "./api/restaurants.route.js" */

const __filename= fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors())

app.use(express.json())

app.use(helmet())

app.use(helmet.crossOriginResourcePolicy({ policy : "cross-origin" }))

app.use(morgan("common"))

app.use(bodyParser.json( { limit: "30mb", extended: true}))

app.use(bodyParser.urlencoded( { limit: "30mb", extended: true}))

app.use("/assets", express.static(path.join(__dirname, 'public/assets')))

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

export default app
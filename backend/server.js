import express from "express"
import cors from "cors"
import helmet from "helmet"
import bodyParser from "body-parser"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import multer from "multer"
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

/* app.use("/api/v1/restaurants", restaurants) */
app.use("*", (req,res) => res.status(404).json({error: "not found"}))

export default app
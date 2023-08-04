import express from "express"
import {
    getSupplier
} from "../controllers/suppliers.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

/* read */
router.get("/:id", verifyToken, getSupplier)

/* update */



export default router
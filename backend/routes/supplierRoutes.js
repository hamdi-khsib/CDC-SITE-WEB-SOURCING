import express from "express"
import {
    getAllSuppliers,
    createNewSupplier,
    updateSupplier,
    deleteSupplier
} from "../controllers/suppliers.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

/* read */
router.get("/", verifyToken, getAllSuppliers)

/* create */
router.post("/", createNewSupplier)

/* update */
router.patch("/", updateSupplier)

/* delete */
router.delete("/", deleteSupplier)


export default router
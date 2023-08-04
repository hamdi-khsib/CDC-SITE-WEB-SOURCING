import express from "express"
import supplierController from "../controllers/supplierController.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

/* read */
router.get("/", verifyToken, supplierController.getAllSuppliers)

/* create */
router.post("/", supplierController.createNewSupplier)

/* update */
router.patch("/", supplierController.updateSupplier)

/* delete */
router.delete("/", supplierController.deleteSupplier)


export default router
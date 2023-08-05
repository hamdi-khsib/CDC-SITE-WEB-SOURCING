import express from "express"
import supplierController from "../controllers/supplierController.js"
import { verifyJWT } from "../middleware/verifyJWT.js"

const router = express.Router()

router.use(verifyJWT)

/* read */
router.get("/", supplierController.getAllSuppliers)

/* create */
router.post("/", supplierController.createNewSupplier)

/* update */
router.patch("/", supplierController.updateSupplier)

/* delete */
router.delete("/", supplierController.deleteSupplier)


export default router
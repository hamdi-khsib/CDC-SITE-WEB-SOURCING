import express from "express"
import buyerController from "../controllers/buyerController.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

/* read */
router.get("/", verifyToken, buyerController.getAllBuyers)

/* create */
router.post("/", buyerController.createNewBuyer)

/* update */
router.patch("/", buyerController.updateBuyer)

/* delete */
router.delete("/", buyerController.deleteBuyer)


export default router
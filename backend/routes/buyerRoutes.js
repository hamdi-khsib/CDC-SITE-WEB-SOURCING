import express from "express"
import buyerController from "../controllers/buyerController.js"
import { verifyJWT } from "../middleware/verifyJWT.js"

const router = express.Router()

router.use(verifyJWT)

/* read */
router.get("/", verifyToken, buyerController.getAllBuyers)

/* create */
router.post("/", buyerController.createNewBuyer)

/* update */
router.patch("/", buyerController.updateBuyer)

/* delete */
router.delete("/", buyerController.deleteBuyer)


export default router
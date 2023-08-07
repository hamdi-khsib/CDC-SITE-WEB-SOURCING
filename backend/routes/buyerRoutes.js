const express = require("express");
const buyerController = require("../controllers/buyerController")
const verifyJWT = require("../middleware/verifyJWT")

const router = express.Router()

router.use(verifyJWT)

/* read */
router.get("/", buyerController.getAllBuyers)

/* create */
router.post("/", buyerController.createNewBuyer)

/* update */
router.patch("/", buyerController.updateBuyer)

/* delete */
router.delete("/", buyerController.deleteBuyer)


module.exports = router
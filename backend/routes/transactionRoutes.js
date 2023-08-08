const express = require("express");
const transactionController = require("../controllers/transactionController")

const router = express.Router()


/* read */
router.get("/", transactionController.getAllTransactions)

/* create */
router.post("/", transactionController.createNewTransaction)

/* update */
router.patch("/", transactionController.updateTransaction)

/* delete */
router.delete("/", transactionController.deleteTransaction)


module.exports = router
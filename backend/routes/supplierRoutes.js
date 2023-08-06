const express = require ("express");
const supplierController = require("../controllers/supplierController")
const verifyJWT = require("../middleware/verifyJWT")

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


module.exports = router
const express = require("express");
const supplierController = require("../controllers/supplierController")
const verifyJWT = require("../middleware/verifyJWT")

const router = express.Router()

router.use(verifyJWT)

/* read */
router.get('/', supplierController.getAllSuppliers)

/* create */
router.post("/", supplierController.createNewSupplier)

/* update */
router.patch("/:supplierId", supplierController.updateSupplier)

/* delete */
router.delete("/:id", supplierController.deleteSupplier)

/* get by id*/
router.get("/:supplierId", supplierController.getSupplierById)

router.get("/:supplierId/articles", supplierController.getArticlesForSupplier)

/* sort by domain */
router.get("/bydomain", supplierController.renderSuppliersByDomain)

/* filter by different attributes */
router.get("/filter", supplierController.filterSuppliers)

/* Compare offers */
router.post("/compare-offers", supplierController.compareOffers)

module.exports = router
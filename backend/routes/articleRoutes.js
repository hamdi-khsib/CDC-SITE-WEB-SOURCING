const express = require("express");
const articleController = require("../controllers/articleController")
const verifyJWT = require("../middleware/verifyJWT")

const router = express.Router()
router.use(verifyJWT)


/* read */
router.get("/", articleController.getAllarticles)

/* create */
router.post("/", articleController.createNewArticle)

/* update */
router.patch("/", articleController.updateArticle)

/* delete */
router.delete("/", articleController.deleteArticle)


module.exports = router
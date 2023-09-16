const express = require("express");
const articleController = require("../controllers/articleController")
const verifyJWT = require("../middleware/verifyJWT")

const router = express.Router()



/* read */
router.get("/", articleController.getAllarticles)

/* create */
router.post("/", articleController.createNewArticle)

/* update */
router.patch("/", articleController.updateArticle)

/* delete */
router.delete("/", articleController.deleteArticle)

router.post('/:id/reviews', articleController.createArticleReview)

router.get('/:id', articleController.getArticleId)


module.exports = router
import express from "express";
import authController from "../controllers/authController.js"

const router = express.Router()

router.post("/login", authController.login)

router.route("/refresh")
    .get()

router.route("/logout")
    .post()
    
export default router

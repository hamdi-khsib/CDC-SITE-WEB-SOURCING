import express from "express";
import authController from "../controllers/authController.js"
const loginLimiter = require("../middleware/loginLimiter")

const router = express.Router()

router.post("/login",loginLimiter, authController.login)

router.route("/refresh")
    .get(authController.refresh)

router.route("/logout")
    .post(authController.logout)
    
export default router

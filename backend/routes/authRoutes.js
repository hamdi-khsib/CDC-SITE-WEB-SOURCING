import express from "express";
import {
    register,
    login,
    refresh,
    logout
} from "../controllers/authController.js"
import loginLimiter from "../middleware/loginLimiter.js"

const router = express.Router()

router.post("/login",loginLimiter, login)

router.route("/refresh")
    .get(refresh)

router.route("/logout")
    .post(logout)
    
export default router

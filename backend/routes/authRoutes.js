const express = require("express");
const authController = require("../controllers/authController")
const loginLimiter = require("../middleware/loginLimiter")
const passport = require('passport');

const router = express.Router()

router.route("/register")
    .post( authController.register)

router.route("/login")
    .post( loginLimiter, authController.login)

router.route("/loginBuyer")
    .post( loginLimiter, passport.authenticate('local'), authController.loginBuyer)

router.route("/refresh")
    .get(authController.refresh)

router.route("/logout")
    .post(authController.logout)

router.get('/confirm', authController.confirmMail);
    
module.exports = router

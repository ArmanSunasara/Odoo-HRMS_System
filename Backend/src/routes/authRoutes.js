const express = require("express");
const { signUp, signIn } = require("../controllers/authController");
const { registerValidationRules, loginValidationRules, validate } = require("../utils/validators");

const router = express.Router();

router.route("/signup").post(registerValidationRules(), validate, signUp);
router.route("/signin").post(loginValidationRules(), validate, signIn);

module.exports = router;

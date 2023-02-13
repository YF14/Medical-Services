const express = require('express')
const router = express.Router()
const {signup,signin} = require('./authController')
const {checkUserDuplicate}=require('./verifySignup')
const {check, body} = require('express-validator')
router.post('/signup',check('phoneNumber').not().isEmpty().isLength({min:6,max:50}).withMessage('phone number is required'), body('password').not().isEmpty().isLength({min:6,max:23}),check('dob').not().isEmpty().isDate(),check('gender').not().isEmpty(),signup )
router.post('/signin', check('email').not().isEmpty().isEmail().isLength({min:6,max:50}).withMessage('email is required'), body('password').not().isEmpty().isLength({min:6,max:23}),signin )

module.exports = router;
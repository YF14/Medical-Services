const express = require('express')
const router = express.Router()
const {getAllHf,getHf,deleteHf,updateHf,hfChangePassword,signup,addDr} = require('./controllerHf')
const {verifyToken,checkUserDuplicate}=require('../auth/verifyToken')
const {check, body,param} = require('express-validator')

//,param('id').not().isEmpty().withMessage('id is required').isLength({max:35})
router.put('/:id',updateHf)
router.post('/changepassword', check('id').not().isEmpty().withMessage('id is required'),check('oldpass').not().isEmpty().isLength({min:6,max:23}).withMessage('oldpass is required'), body('password').not().isEmpty().isLength({min:6,max:23}),hfChangePassword)
router.delete('/:id',deleteHf)
router.post('/signup',check('phoneNumber').not().isEmpty().isLength({min:6,max:50}).withMessage('phone number is required'), body('password').not().isEmpty().isLength({min:6,max:23}),check('dob').not().isEmpty().isDate(),check('gender').not().isEmpty(), signup)
router.get('/',getAllHf )
router.get('/:id',getHf )
router.post('/addDr',check('phoneNumber').not().isEmpty().isLength({min:6,max:50}).withMessage('phone number is required'),addDr)

// ,verifyToken
// ,verifyToken
// ,verifyToken
// ,verifyToken

module.exports = router;
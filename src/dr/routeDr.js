const express = require('express')
const router = express.Router()
const {getAllDr,getDr,deleteDr,updateDr,drChangePassword,signup,addSpecialties} = require('./controllerDr')
const {verifyToken,checkUserDuplicate}=require('../auth/verifyToken')
const {check, body,param} = require('express-validator')

//,param('id').not().isEmpty().withMessage('id is required').isLength({max:35})
router.put('/:id',updateDr)
router.post('/changepassword', check('id').not().isEmpty().withMessage('id is required'),check('oldpass').not().isEmpty().isLength({min:6,max:23}).withMessage('oldpass is required'), body('password').not().isEmpty().isLength({min:6,max:23}),drChangePassword)
router.delete('/:id',deleteDr)
router.post('/signup',check('phoneNumber').not().isEmpty().isLength({min:6,max:50}).withMessage('phone number is required'), body('password').not().isEmpty().isLength({min:6,max:23}),check('dob').not().isEmpty().isDate(),check('gender').not().isEmpty(), signup)
router.get('/',getAllDr )
router.get('/:id',getDr )
router.post('/addSpecialties',check('name').not().isEmpty().withMessage('name is required'),addSpecialties)

// ,verifyToken
// ,verifyToken
// ,verifyToken
// ,verifyToken

module.exports = router;
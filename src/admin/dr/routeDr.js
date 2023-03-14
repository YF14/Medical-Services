const express = require('express')
const router = express.Router()
const {getAllDr,getDr,deleteDr,updateDr,signup,addSpecialties,getAllDrSameSpec,changeAvailable} = require('./controllerDr')
const {verifyToken,checkUserDuplicate}=require('../auth/verifyToken')
const {check, body,param} = require('express-validator')

router.put('/:id',verifyToken(["dr","superadmin"]),updateDr)
router.delete('/:id',verifyToken(["dr","superadmin"]),deleteDr)
router.post('/signup',check('phoneNumber').not().isEmpty().isLength({min:6,max:50}).withMessage('phone number is required'), body('password').not().isEmpty().isLength({min:6,max:23}),check('dob').not().isEmpty().isDate(),check('gender').not().isEmpty(), signup)
router.get('/',verifyToken(["user","hf","dr","superadmin"]),getAllDr )
router.post('/getAllDrSameSpec',verifyToken(["user","hf","dr","superadmin"]),getAllDrSameSpec )
router.get('/:id',verifyToken(["user","hf","dr","superadmin"]),getDr )
router.post('/changeAvailable',verifyToken(["hf","dr","superadmin"]),changeAvailable )
router.post('/addSpecialties',check('name').not().isEmpty().withMessage('name is required'),verifyToken(["dr","superadmin"]),addSpecialties)

// ,verifyToken
// ,verifyToken
// ,verifyToken
// ,verifyToken

module.exports = router;
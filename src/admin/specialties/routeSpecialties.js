const express = require('express')
const router = express.Router()
const {getAllSpecialties,getSpecialties,deleteSpecialties,updateSpecialties,addSpecialties} = require('./controllerSpecialties')
const {verifyToken,checkUserDuplicate}=require('../auth/verifyToken')
const {check, body,param} = require('express-validator')

router.put('/:id',verifyToken(["superadmin"],updateSpecialties))
router.delete('/:id',verifyToken(["superadmin"]),deleteSpecialties)
router.get('/',getAllSpecialties )
router.get('/one',getSpecialties )
router.post('/addSpecialties',check('name').not().isEmpty().withMessage('name number is required'),verifyToken(["superadmin"]),addSpecialties)

// ,verifyToken
// ,verifyToken
// ,verifyToken
// ,verifyToken

module.exports = router;
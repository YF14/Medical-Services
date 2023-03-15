const express = require('express')
const router = express.Router()
const {getAllHf,getHf,deleteHf,updateHf,getNearMe,signup,addDr,addSpecialties,getAllHfByRating} = require('./controllerHf')
const {verifyToken,checkUserDuplicate}=require('../auth/verifyToken')
const {check, body,param} = require('express-validator')

//,param('id').not().isEmpty().withMessage('id is required').isLength({max:35})
router.put('/:id',verifyToken(["hf","superadmin"]),updateHf)
router.delete('/:id',verifyToken(["hf","superadmin"]),deleteHf)
router.get(
    "/getNearMe",
    verifyToken(["user", "hf", "dr", "superadmin"]),
    getNearMe
  );
  router.get("/getAllHfByRating", getAllHfByRating);

router.post('/signup',check('phoneNumber').not().isEmpty().isLength({min:6,max:50}).withMessage('phone number is required'), body('password').not().isEmpty().isLength({min:6,max:23}),check('dob').not().isEmpty().isDate(),check('gender').not().isEmpty(), signup)
router.get('/',getAllHf )
router.get('/:id',getHf )
router.post('/addDr',check('phoneNumber').not().isEmpty().isLength({min:6,max:50}).withMessage('phone number is required'),verifyToken(["hf","superadmin"]),addDr)
router.post('/addSpecialties',check('name').not().isEmpty().withMessage('name is required'),verifyToken(["hf","superadmin"]),addSpecialties)



// ,verifyToken
// ,verifyToken
// ,verifyToken
// ,verifyToken

module.exports = router;
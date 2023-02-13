const express = require('express')
const router = express.Router()
const {getAllFacility,getFacility,deleteFacility,updateFacility,facilityChangePassword} = require('./controllerHealthFacility')
const {verifyToken,checkUserDuplicate}=require('../auth/verifyToken')
const {check, body,param} = require('express-validator')
router.get('/',getAllFacility )
router.get('/:id',checkUserDuplicate,getFacility )
//,param('id').not().isEmpty().withMessage('id is required').isLength({max:35})
router.put('/:id',checkUserDuplicate,updateFacility)
router.post('/changepassword', check('id').not().isEmpty().withMessage('id is required'),check('oldpass').not().isEmpty().isLength({min:6,max:23}).withMessage('oldpass is required'), body('password').not().isEmpty().isLength({min:6,max:23}),facilityChangePassword)
router.delete('/:id',checkUserDuplicate,deleteFacility)
// ,verifyToken
// ,verifyToken
// ,verifyToken
// ,verifyToken

module.exports = router;
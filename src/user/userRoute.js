const express = require('express')
const router = express.Router()
const {getAllUser,getUser,deleteUser,updateUser,userChangePassword} = require('./userController')
const {verifyToken,checkUserDuplicate}=require('../auth/verifyToken')
const {check, body,param} = require('express-validator')
router.get('/',verifyToken,getAllUser )
//router.get('/:id',param('id').not().isEmpty().withMessage('id is required').isLength({max:35}),verifyToken,checkUserDuplicate,getUser )
router.put('/:id',verifyToken,checkUserDuplicate,updateUser)
router.post('/changepassword', check('id').not().isEmpty().withMessage('id is required'),check('oldpass').not().isEmpty().isLength({min:6,max:23}).withMessage('oldpass is required'), body('password').not().isEmpty().isLength({min:6,max:23}),userChangePassword)
router.delete('/:id',verifyToken,checkUserDuplicate,deleteUser)


module.exports = router;
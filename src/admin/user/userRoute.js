const express = require('express')
const router = express.Router()
const {getAllUser,getUser,deleteUser,updateUser,userChangePassword,addFavorite,removeFavorite} = require('./userController')
const {verifyToken,checkUserDuplicate}=require('../auth/verifyToken')
const {check, body,param} = require('express-validator')
router.get('/',verifyToken(["superadmin"]),getAllUser )
router.get('/:id',checkUserDuplicate,verifyToken(["user","dr","hf","superadmin"]),getUser )
//,param('id').not().isEmpty().withMessage('id is required').isLength({max:35})
router.put('/:id',checkUserDuplicate,verifyToken(["user","superadmin"]),updateUser)
router.post('/changepassword', check('id').not().isEmpty().withMessage('id is required'),check('oldpass').not().isEmpty().isLength({min:6,max:23}).withMessage('oldpass is required'), body('password').not().isEmpty().isLength({min:6,max:23}),verifyToken(["dr","hf","user","superadmin"]),userChangePassword)
router.delete('/:id',checkUserDuplicate,verifyToken(["user","superadmin"]),deleteUser)
router.post('/addFavorite', check('id').not().isEmpty().withMessage('id is required'),check('phoneNumber').not().isEmpty().withMessage('phoneNumber is required'),verifyToken(["user","superadmin"]),addFavorite)
router.post('/removeFavorite', check('id').not().isEmpty().withMessage('id is required'),check('phoneNumber').not().isEmpty().withMessage('phoneNumber is required'),verifyToken(["user","superadmin"]),removeFavorite)

// ,verifyToken
// ,verifyToken
// ,verifyToken
// ,verifyToken

module.exports = router;
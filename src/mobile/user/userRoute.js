const express = require('express')
const router = express.Router()
const {getAllUser,getUser,deleteUser,updateUser,userChangePassword,addFavorite,removeFavorite} = require('./userController')
const {verifyToken,checkUserDuplicate}=require('../auth/verifyToken')
const {check, body,param} = require('express-validator')
router.get('/:id',checkUserDuplicate,verifyToken(["user","dr","hf","superadmin"]),getUser )
router.post('/addFavorite', check('id').not().isEmpty().withMessage('id is required'),check('phoneNumber').not().isEmpty().withMessage('phoneNumber is required'),verifyToken(["user","superadmin"]),addFavorite)
router.post('/removeFavorite', check('id').not().isEmpty().withMessage('id is required'),check('phoneNumber').not().isEmpty().withMessage('phoneNumber is required'),verifyToken(["user","superadmin"]),removeFavorite)

// ,verifyToken
// ,verifyToken
// ,verifyToken
// ,verifyToken

module.exports = router;
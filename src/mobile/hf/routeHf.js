const express = require('express')
const router = express.Router()
const {getAllHf,getHf,deleteHf,updateHf,hfChangePassword,signup,addDr,addSpecialties} = require('./controllerHf')
const {verifyToken,checkUserDuplicate}=require('../auth/verifyToken')
const {check, body,param} = require('express-validator')

router.get('/:id',verifyToken(["hf","superadmin"]),getHf )

module.exports = router;
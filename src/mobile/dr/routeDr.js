const express = require('express')
const router = express.Router()
const {getAllDr,getDr,deleteDr,updateDr,drChangePassword,signup,addSpecialties} = require('./controllerDr')
const {verifyToken,checkUserDuplicate}=require('../auth/verifyToken')
const {check, body,param} = require('express-validator')

router.get('/',verifyToken(["superadmin"]),getAllDr )
router.get('/:id',verifyToken(["dr","superadmin"]),getDr )


module.exports = router;
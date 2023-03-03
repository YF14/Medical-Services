const express = require('express')
const router = express.Router()
const {
    addbookingAv} = require('./controllerBooking')
    // getAllBooking,
    // getBooking,
    // updateBooking,
    // deleteBooking,
    // addBooking,
const {verifyToken,checkUserDuplicate}=require('../auth/verifyToken')
const {check, body,param} = require('express-validator')

// router.put('/:id',updateBooking)
// router.delete('/:id',deleteBooking)
// router.get('/',getAllBooking )
// router.get('/:id',getBooking )
router.post('/addbookingAv',addbookingAv)
// router.post('/addbooking',addBooking)

// ,verifyToken
// ,verifyToken
// ,verifyToken
// ,verifyToken

module.exports = router;
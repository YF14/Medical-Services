const express = require('express')
const router = express.Router()
const {
    updateBooking, deleteBookingAv,getBookingAv, addbookingAv,getAllBookingAv,addBooking,getAllBooking,getBooking} = require('./controllerBooking')
     
    
    
     
    
const {verifyToken,checkUserDuplicate}=require('../auth/verifyToken')
const {check, body,param} = require('express-validator')



 router.post('/addbooking',verifyToken(["hf","dr","user","superadmin"]),addBooking)
 router.get('/',verifyToken(["superadmin"]),getAllBookingAv )
 router.put('/:id',verifyToken(["hf","dr","superadmin"]),updateBooking)
 router.get('/:id',verifyToken(["hf","dr","user","superadmin"]),getBookingAv )
 router.get('/booked/:id',verifyToken(["hf","dr","user","superadmin"]),getBooking )
// ,verifyToken
// ,verifyToken
// ,verifyToken
// ,verifyToken

module.exports = router;
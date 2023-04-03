const express = require('express')
const router = express.Router()
const {
    updateBooking, deleteBookingAv,getBookingAv, addbookingAv,getAllBookingAv,addBooking,getAllBooking,getBooking,getAllBookingAvByDr,getAllBookingByUser,getAllBookingAvbyDate} = require('./controllerBooking')
     
    
    
     
    
const {verifyToken,checkUserDuplicate}=require('../auth/verifyToken')
const {check, body,param} = require('express-validator')



 router.post('/addbookingAv',verifyToken(["hf","dr","superadmin"]),addbookingAv)
 router.post('/addbooking',verifyToken(["hf","dr","user","superadmin"]),addBooking)
 router.get('/booked',verifyToken(["superadmin"]),getAllBooking )
 router.get('/',verifyToken(["superadmin"]),getAllBookingAv )
 router.post('/dr',verifyToken(["user","hf","dr","superadmin"]),getAllBookingAvByDr )
 router.post('/date/dr',verifyToken(["user","hf","dr","superadmin"]),getAllBookingAvbyDate )

 router.get('/user/:id',verifyToken(["user","hf","dr","superadmin"]),getAllBookingByUser )
 router.put('/:id',verifyToken(["hf","dr","superadmin"]),updateBooking)
 router.delete('/:id',verifyToken(["hf","dr","superadmin"]),deleteBookingAv)
 router.get('/:id',verifyToken(["hf","dr","user","superadmin"]),getBookingAv)
 router.get('/booked/:id',verifyToken(["hf","dr","user","superadmin"]),getBooking )
// ,verifyToken
// ,verifyToken
// ,verifyToken
// ,verifyToken

module.exports = router;
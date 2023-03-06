const express = require('express')
const router = express.Router()
const {
    updateBooking, deleteBookingAv,getBookingAv, addbookingAv,getAllBookingAv,addBooking,getAllBooking,getBooking} = require('./controllerBooking')
     
    
    
     
    
const {verifyToken,checkUserDuplicate}=require('../auth/verifyToken')
const {check, body,param} = require('express-validator')



router.post('/addbookingAv',addbookingAv)
 router.post('/addbooking',addBooking)
 router.get('/booked',getAllBooking )
 router.get('/',getAllBookingAv )
 router.put('/:id',updateBooking)
 router.delete('/:id',deleteBookingAv)
 router.get('/:id',getBookingAv )
  router.get('/booked/:id',getBooking )
// ,verifyToken
// ,verifyToken
// ,verifyToken
// ,verifyToken

module.exports = router;
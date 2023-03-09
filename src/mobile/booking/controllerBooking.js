let jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { success, error } = require("../../../utiles/responser");
let bcrypt = require("bcryptjs");
const { PrismaClient, Prisma } = require("@prisma/client");
const { Booking,BookingAv,time } = new PrismaClient();

const addbookingAv = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }

  try {const {time,date,start,end,drId} = req.body;
    var datee = new Date(date)
  var userTimezoneOffset = datee.getTimezoneOffset() * 60000;
  datee=new Date(datee.getTime() - userTimezoneOffset);
  

     const check = await BookingAv.findMany({
    where :{date: new Date(datee),dr:{every:{id:drId}}},
   })
   console.log(check)
if (check.length>0)
return res.status(400).json("wrong date");
let timeStart=start.split(':')
    let timeEnd=end.split(':')
    let time_start=new Date(date)
    let time_end=new Date(date)
     time_start.setHours(timeStart[0], timeStart[1], 0)
     time_end.setHours(timeEnd[0], timeEnd[1], 0)

let total =(((time_end - time_start)/60000 )/time) // millisecond 
let i=0
let timee=new Array(new Date(time_start.getTime()));
while(i<total-1)
{ let temp = new Date(timee[i])
  
  timee.push(`${new Date(temp.getTime() + time*60000)}`)
  i++
}
  i=0
  var resulte=[]
  while(i<total)
{ let temp = new Date(timee[i])
  resulte[i]=[(`${temp.getHours() + ':' + temp.getMinutes()}`)]
  i++
} 
console.log(resulte)

 const bookingAv= await BookingAv.create({
      data: {
      time:{ create: resulte.map(e => ({ time:e.toString()})),
      },
        
      
      date:new Date(datee),
      dr:{
             
        connect:{id:drId}
     
     }
    },
    include:{time:true}
    });
    res.json(success(201, bookingAv,"new bookingAv "));
  } catch (err) {
    console.log(err);
    res.status(500).json(error(500, err));
  }
};
const addBooking = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }
  const {name,phoneNumber,date,time,userId,drId} = req.body;
  try {var datee = new Date(date)
    var userTimezoneOffset = datee.getTimezoneOffset() * 60000;
    datee=new Date(datee.getTime() - userTimezoneOffset);
    
   const check = await BookingAv.findFirst({include:{time:{where:{time:time,av:true}}},
    where :{date: new Date(datee),dr:{every:{id:drId}}},
  })

     
  if (!check||!check.time.length>0)
  return res.status(400).json("wrong date");
     
    const booking = await Booking.create({
      data: {time,
      name,
      phoneNumber:parseInt(phoneNumber),
      dr:{ 
        connect:{id:drId}
     },
     user:{   
      connect:{id:userId}
   },
  }
    });
    const temp = await BookingAv.update({ where:{id:check.id}
     ,include:{time:true},
     data:{
     time:{update:{data:{av:false},where:{id:check.time[0].id}}

     }
   }} )
     console.log(temp)
    res.json(success(201, booking, "done "));
  } catch (err) {
    console.log(err);
    res.status(500).json(error(500, err));
  }
};
const getAllBookingAv = async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);
  try {
    const count = await BookingAv.count();
  
  if(!count>0)
  return res.status(404).json("empty");

  let sizes = 2;
  let pages = 1;
  if (!Number.isNaN(size) && size > 0 && size <= 10) sizes = size;
  if (!Number.isNaN(page) && page > 0) pages = page;
  let nPage = Math.ceil(count / sizes);
  if (pages > nPage) pages = nPage;
  const booking = await BookingAv.findMany({
    skip: (pages - 1) * sizes,
    take: sizes,
   include:{time :true,dr:true}
  });
  console.log("SdSD", sizes, pages, nPage);
  res.json(success(`current_page: ${pages}`,booking, `TOTAL PAGES ${nPage}`));
} catch (errorr) {console.log(errorr)
  return res.status(500).json(error(500, errorr));

}};
const getBookingAv = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }
  let id =req.params.id
  try {
    const booking = await BookingAv.findUnique({
      where: { id:id},
      include:{time :true,dr:true}
    });
    if (!booking) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("200", booking, "sdas"));
  } catch (err) {
    console.log("ewaweaw", err);
    return res.status(500).json(error(500, "server side error"));
  }
};
const updateBooking = async (req, res) => {

  try {const {date,time,drId} = req.body;
  var datee = new Date(date)
    var userTimezoneOffset = datee.getTimezoneOffset() * 60000;
    datee=new Date(datee.getTime() - userTimezoneOffset);
    
  
   const check = await BookingAv.findFirst(
    {include:{time:{where:{time:time,av:true}}},
    where :{date: new Date(datee),dr:{every:{id:drId}}},

    
     
     })
     if (!check||!check.time.length>0)
     return res.status(400).json("wrong date");
    const temp = await BookingAv.update({ where:{id:check.id}
     ,include:{time:true},
     data:{
     time:{update:{data:{av:false},where:{id:check.time[0].id}}

     }
   }} )
     console.log(temp)
    res.json(success(201, temp, "done "));
  } catch (err) {
    console.log(err);
    res.status(500).json(error(500, err));
  }
};
const deleteBookingAv = async (req, res) => {
  try {  let id =req.params.id
    let booking = await BookingAv.delete({
      where: {
        id:(id)
      },
     
    });
    if (!booking) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("201", booking, "deleted"));
  } catch (err) {
    res.status(500).json(error(500, err));
  }
};
///////////////////////////////////////////////////////////////////////////////////
const getAllBooking = async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);
  try {
    const count = await Booking.count();
  
  if(!count>0)
  return res.status(404).json("empty");

  let sizes = 2;
  let pages = 1;
  if (!Number.isNaN(size) && size > 0 && size <= 10) sizes = size;
  if (!Number.isNaN(page) && page > 0) pages = page;
  let nPage = Math.ceil(count / sizes);
  if (pages > nPage) pages = nPage;
  const booking = await Booking.findMany({
    skip: (pages - 1) * sizes,
    take: sizes,
    include:{user :true,dr:true}
  });
  console.log("SdSD", sizes, pages, nPage);
  res.json(success(`current_page: ${pages}`,booking, `TOTAL PAGES ${nPage}`));
} catch (errorr) {console.log(errorr)
  return res.status(500).json(error(500, errorr));

}};
const getBooking = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }
  let id =req.params.id
  try {
    const booking = await Booking.findUnique({
      where: { id:id},
      include:{user :true,dr:true}
    });
    if (!booking) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("200", booking, "sdas"));
  } catch (err) {
    console.log("ewaweaw", err);
    return res.status(500).json(error(500, "server side error"));
  }
};


module.exports = {getAllBooking,
  getBooking,
   getAllBookingAv,
   getBookingAv,
   updateBooking,
  deleteBookingAv,
   addBooking,
  addbookingAv
};

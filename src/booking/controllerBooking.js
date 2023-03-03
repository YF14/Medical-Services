let jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { success, error } = require("../../utiles/responser");
let bcrypt = require("bcryptjs");
const { PrismaClient, Prisma } = require("@prisma/client");
const moment = require("moment/moment");
const { Booking,BookingAv,Dr } = new PrismaClient();

const addbookingAv = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }

  try {
   

    const {time,date,start,end,drId} = req.body;
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
  timee[i]=[(`${temp.getHours() + ':' + temp.getMinutes()}`),"true"]
  resulte.push(timee[i])
  i++
} 

  console.log(resulte) 
 const bookingAv= await BookingAv.create({
      data: {
      time:resulte.toString(),
      date:new Date(date),
      dr:{
             
        connect:{id:drId}
     
     }
    
    }
    });
    res.json(success(201, bookingAv,"new bookingAv "));
  } catch (err) {
    console.log(err);
    res.status(500).json(error(500, err));
  }
};
// const addBooking = async (req, res) => {
//   let errors = validationResult(req).array();
//   if (errors && errors.length > 0) {
//     return res.status(400).json(error(400, errors));
//   }

//   try {
   

//     const {name,phoneNumber,time,date,userId,drId} = req.body;
//     const booking = await Booking.create({
//       data: {
//       name,
//       time,
//       phoneNumber,
//       date,
//       dr:{
             
//         connect:{id:drId}
     
//      }
    
//     }
//     });
//     res.json(success(201, booking, "new Specialties "));
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(error(500, err));
//   }
// };
// const getAllBooking = async (req, res) => {
//   const size = parseInt(req.query.size);
//   const page = parseInt(req.query.page);
//   try {
//     const count = await Specialties.count();
  
//   if(!count>0)
//   return res.status(404).json("empty");

//   let sizes = 2;
//   let pages = 1;
//   if (!Number.isNaN(size) && size > 0 && size <= 10) sizes = size;
//   if (!Number.isNaN(page) && page > 0) pages = page;
//   let nPage = Math.ceil(count / sizes);
//   if (pages > nPage) pages = nPage;
//   const spec = await Specialties.findMany({
//     skip: (pages - 1) * sizes,
//     take: sizes,
   
//   });
//   console.log("SdSD", sizes, pages, nPage);
//   res.json(success(`current_page: ${pages}`, spec, `TOTAL PAGES ${nPage}`));
// } catch (errorr) {console.log(errorr)
//   return res.status(500).json(error(500, errorr));

// }};
// const getBooking = async (req, res) => {
//   let errors = validationResult(req).array();
//   if (errors && errors.length > 0) {
//     return res.status(400).json(error(400, errors));
//   }
//   let id =req.params.id
//   try {
//     const spec = await Specialties.findUnique({
//       where: { id:parseInt(id)},
     
//     });
//     if (!spec) {
//       return res.status(404).json(error(404, "Not Found"));
//     }
//     res.json(success("200", spec, "sdas"));
//   } catch (err) {
//     console.log("ewaweaw", err);
//     return res.status(500).json(error(500, "server side error"));
//   }
// };
// const updateBooking = async (req, res) => {
//   const {
//     name,
    
//   } = req.body;

//   try {  let id =req.params.id

//     const spec = await Specialties.update({where:{id:parseInt(id)},
   

//       data: {
//        name,}
//     });
//     res.json(spec);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(error(500, err));
//   }
// };
// const deleteBooking = async (req, res) => {
//   try {  let id =req.params.id
//     let spec = await Specialties.delete({
//       where: {
//         id:parseInt(id)
//       },
     
//     });
//     if (!spec) {
//       return res.status(404).json(error(404, "Not Found"));
//     }
//     res.json(success("201", spec, "deleted"));
//   } catch (err) {
//     res.status(500).json(error(500, err));
//   }
// };

module.exports = {
  // getAllBooking,
  // getBooking,
  // updateBooking,
  // deleteBooking,
  // addBooking,
  addbookingAv
};

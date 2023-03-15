let jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { success, error } = require("../../../utiles/responser");
let bcrypt = require("bcryptjs");
const { PrismaClient, Prisma } = require("@prisma/client");
const { hf, User, role, setting,address,dr,Specialties } = new PrismaClient();

const signup = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }

  try {
    const hashedPassword = await bcrypt.hashSync(req.body.password, 10);

    const {
      phoneNumber,
      name,
      roleName,
      avatar,
      bio,
      dob,
      gender,
      town,
      city,
      description,
      drNumbers,
      openAt,
      closeAt,
      specialtiesNumbers,
      rating,isAvailable
    } = req.body;
    const hff = await hf.create({
      data: {
        description,
        closeAt,
        openAt,
        drNumbers,
        specialtiesNumbers,
        rating,
        isAvailable,
        user: {
          create: {
            phoneNumber,
            name,
            password: hashedPassword,

            role: {
              create: { name: roleName, isVerify: true },
            },
            setting: {
              create: {
                avatar,
                bio, 
                dob: new Date(dob),
                gender,
              },
            },
            address: {
              create: {
                city,
                town,
              },
            },
          },
        },
      },
    });
    res.json(success(201, hff, "new user "));
  } catch (err) {
    console.log(err);
    res.status(500).json(error(500, err));
  }
};
const getAllHf = async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);
  try {
    const count = await hf.count();
  
  if(!count>0)
  return res.status(404).json("empty");

  let sizes = 2;
  let pages = 1;
  if (!Number.isNaN(size) && size > 0 && size <= 10) sizes = size;
  if (!Number.isNaN(page) && page > 0) pages = page;
  let nPage = Math.ceil(count / sizes);
  if (pages > nPage) pages = nPage;
  const hff = await hf.findMany({
    skip: (pages - 1) * sizes,
    take: sizes,
    include: { dr:true,specialties:true,user: { include: { setting: true, role: true }} },
  });
  console.log("SdSD", sizes, pages, nPage);
  res.json(success(`current_page: ${pages}`, hff, `TOTAL PAGES ${nPage}`));
} catch (errorr) {console.log(errorr)
  return res.status(500).json(error(500, errorr));

}};

const getHf = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }
  try {
    const hff = await hf.findUnique({
      where: { id: req.params.id },
      include: { dr:true,specialties:true,user: { include: { setting: true, role: true }} },
    });
    if (!hff) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("200", hff, "sdas"));
  } catch (err) {
    console.log("ewaweaw", err);
    return res.status(500).json(error(500, "server side error"));
  }
};
const getNearMe = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }
  
  let user = await User.findFirst({where:{id:req.user.id},include:{address:true}})
  if (!user) 
  return res.status(404).json(error(404, "Not Found"));

  try {
    const drr = await hf.findMany({where:{user:{address:{city:user.address.city}}},include:{user:{include:{address:true,role:true,setting:true}}}});
    if (!drr) {
      return res.status(404).json(error(404, "Not Found"));
    } 
    res.json(success("200", drr, "done"));
  } catch (err) {
    console.log("ewaweaw", err);
    return res.status(500).json(error(500, "server side error"));
  }
};
const updateHf = async (req, res) => {
  const {
    name,
    avatar,
    dob,
    gender,
    language,
    darkmode,
    description,
    cost,
    city,
    town,
    xp,
    openAt,
    closeAt,
    bio,
    rating,
    isAvailable
  } = req.body;

  try {
    const hff = await hf.update({where:{id:req.params.id},
      include: { dr:true,specialties:true,user: { include: { setting: true, role: true }} },

      data: {
        description,
        closeAt,
        openAt,
        cost,
        xp,
        rating,
        isAvailable,
        user: {
          update: {
           
            name,
          


            setting: {
              update: {
                avatar,
                bio,
                dob: new Date(dob),
                gender,
                language,
                darkmode,
              },
            },
            address: {
              update: {
                city,
                town,
              },
            },
          },
        },
      },
    });
    res.json(hff);
  } catch (err) {
    console.log(err);
    res.status(500).json(error(500, err));
  }
};
const deleteHf = async (req, res) => {
  try {
    let hff = await hf.delete({
      where: {
        id: req.params.id,
      },
      include: { dr:true,specialties:true,user: { include: { setting: true, role: true }} },
    });
    if (!hff) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("201", hff, "deleted"));
  } catch (err) {
    res.status(500).json(error(500, err));
  }
};


const addDr = async (req, res) => {
  try {let phoneNumber=req.body.phoneNumber
   let drr = await dr.findFirst({where:{user:{phoneNumber}}})
 console.log(drr)
    if(!drr)
    return res.status(404).json(error(404, "Not Found"));

    let id = req.body.id
    const hff = await hf.update({where:{id},
      include:{  dr: { include: { user: true} }},
  
        data: {
          dr:{
             
             connect:{id:drr.id}
          
          }}
      });
   

    if (!hff) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("201", hff, "done"));
  } catch (err) {console.log(err)
    res.status(500).json(error(500, err));
  }
};

const addSpecialties = async (req, res) => {
  try {let name=req.body.name

   let spec = await Specialties.findMany({where:{name:{in: name}}})
 console.log(spec)
    if(!spec)
    return res.status(404).json(error(404, "Not Found"));

    let id = req.body.id
    const hff = await hf.update({where:{id},  
        data: {
          specialties:{
           
              connect:spec.map(c => ({ id: parseInt(c.id)})) || [], }
             
          
          }
      });
   

    if (!hff) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("201", hff, "done"));
  } catch (err) {console.log(err)
    res.status(500).json(error(500, err));
  }
};
const getAllHfByRating = async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);
  try {
    const count = await dr.count();
    if (!count > 0) return res.status(404).json("empty");

    let sizes = 2;
    let pages = 1;
    if (!Number.isNaN(size) && size > 0 && size <= 10) sizes = size;
    if (!Number.isNaN(page) && page > 0) pages = page;
    let nPage = Math.ceil(count / sizes);
    if (pages > nPage) pages = nPage;
    const drr = await hf.findMany({
      orderBy: {rating:{ sort: 'desc', nulls: 'last' }},
      skip: (pages - 1) * sizes,
      take: sizes,
      include: {
            user: { include: { address: true, setting: true, role: true } },
    
      },
    });
    console.log("SdSD", sizes, pages, nPage);
    res.json(success(`current_page: ${pages}`, drr, `TOTAL PAGES ${nPage}`));
  } catch (errorr) {
    console.log(errorr);
    return res.status(500).json(error(500, errorr));
  }
};
module.exports = {
  getAllHf,
  getHf,
  updateHf,
  deleteHf,
  signup,
  addDr,
  addSpecialties,
  getNearMe,
  getAllHfByRating
};

let jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { success, error } = require("../../utiles/responser");
let bcrypt = require("bcryptjs");
const { PrismaClient, Prisma } = require("@prisma/client");
const { hf, user, role, setting,address,dr,Specialties } = new PrismaClient();

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
    } = req.body;
    const hff = await hf.create({
      data: {
        description,
        closeAt,
        openAt,
        drNumbers,
        specialtiesNumbers,
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

const hfChangePassword = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }
  const { id, oldpass } = req.body;
  const hff = await hf.findUnique({ where: { id: id } });
  if (!hff) {
    return res.status(404).json(error(404, "Not Found"));
  }
  let ok = await bcrypt.compare(oldpass, user.password);
  if (ok) {
    const hashedPassword = await bcrypt.hashSync(req.body.password, 10);
    try {
      await hf.update({
        data: {
          user: { update: { password: hashedPassword } },
        },
      });

      res.json({ hff });
    } catch (err) {
      res.status(500).json(error(500, err));
    }
  } else res.status(500).json(error(500, "wrong password"));
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
module.exports = {
  getAllHf,
  getHf,
  updateHf,
  deleteHf,
  hfChangePassword,
  signup,
  addDr,
  addSpecialties
};

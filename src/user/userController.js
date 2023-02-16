let jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { success, error } = require("../../utiles/responser");
let bcrypt = require("bcryptjs");
const { PrismaClient, Prisma } = require("@prisma/client");
const { User, role, setting,Favorite,dr ,hf} = new PrismaClient();

const getAllUser = async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);
  try {
    const count = await User.count();
  
  if(!count>0)
  return res.status(404).json("empty");

  let sizes = 2;
  let pages = 1;
  if (!Number.isNaN(size) && size > 0 && size <= 10) sizes = size;
  if (!Number.isNaN(page) && page > 0) pages = page;
  let nPage = Math.ceil(count / sizes);
  if (pages > nPage) pages = nPage;
  const user = await User.findMany({
    skip: (pages - 1) * sizes,
    take: sizes,
    include: { setting: true, role: true,address:true,favoritedr:true ,favoritehf:true},
  });
  console.log("SdSD", sizes, pages, nPage);
  res.json(success(`current_page: ${pages}`, user, `TOTAL PAGES ${nPage}`));
} catch (errorr) {console.log(errorr)
  return res.status(500).json(error(500, errorr));

}};
const getUser = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }
  try { 
    const user = await User.findUnique({
      where: { id: req.params.id },
      include: { setting: true, role: true,address:true,favoritedr:true ,favoritehf:true},
    });
    if (!user) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("200", user, "sdas"));
  } catch (e) {
    console.log("ewaweaw", e);
  }
};
const updateUser = async (req, res) => {
  const { name, avatar, dob, gender, language, darkmode, bio,city,town } = req.body;
 
  try {
    const user = await User.update({where:{id:req.params.id},
    include: { setting: true, role: true, address: true } ,

      data: {         
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
        
      
    });
    if (user > 0) {
      return res.status(404).json(error(404, "Not Found"));
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(error(500, err));
  }
};
const deleteUser = async (req, res) => {
  try {
    let user = await User.delete({
      where: {
        id: req.params.id,
      },      
      include: { setting: true, role: true,address:true,favoritedr:true ,favoritehf:true},
    });
  // if(user.role.name=="dr")
  // await dr.delete({where:{id:}})
    if (!user) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("201", user, "deleted"));
  } catch (err) {
    res.status(500).json(error(500, err));
  } 
};

const userChangePassword = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }
  const { id, oldpass } = req.body;
  const user = await User.findUnique({ where: { id: id } });
  if (!user) {
    return res.status(404).json(error(404, "Not Found"));
  }
  let ok = await bcrypt.compare(oldpass, user.password);
  if (ok) {
    const hashedPassword = await bcrypt.hashSync(req.body.password, 10);
    try {
      await User.update({ password: hashedPassword }, { where: { id: id } });

      res.json({ user });
    } catch (err) {
      res.status(500).json(error(500, err));
    }
  } else res.status(500).json(error(500, "wrong password"));
};
const addFavorite = async (req, res) => {
  try {let phoneNumber=req.body.phoneNumber
let type=req.body.type
let drr
let hff
let id = req.body.id
if(type=="dr"){
    drr = await dr.findFirst({where:{user:{phoneNumber}}})
    if(!drr)
    return res.status(404).json(error(404, "Not Found"));
     hff = await User.update({where:{id},  
      data: {
        favoritedr:{
            connect: {id:drr.id}
        }},
       
        
    });
  }
   else if (type=="hf")
   {    drr = await hf.findFirst({where:{user:{phoneNumber}}})  
   if(!drr)
   return res.status(404).json(error(404, "Not Found"));
   hff = await User.update({where:{id},  
    data: {
      favoritehf:{
        connect: {id:drr.id}}}
  });
  
}

  else     return res.status(404).json(error(404, "type Not Found"));

   
    if (!hff) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("201", hff, "done"));
  } catch (err) {console.log(err)
    res.status(500).json(error(500, err));
  }
};
const removeFavorite = async (req, res) => {
  try {
let phoneNumber=req.body.phoneNumber
let type=req.body.type
let drr
let hff
let id = req.body.id
if(type=="dr"){
    drr = await dr.findFirst({where:{user:{phoneNumber}}})
    if(!drr)
    return res.status(404).json(error(404, "Not Found"));
     hff = await User.update({where:{id},  
      data: {
        favoritedr:{
          disconnect: {id:drr.id}
        }},
       
        
    });
  }
   else if (type=="hf")
   {    drr = await hf.findFirst({where:{user:{phoneNumber}}})  
   if(!drr)
   return res.status(404).json(error(404, "Not Found"));
   hff = await User.update({where:{id},  
    data: {
      favoritehf:{
        disconnect: {id:drr.id}}}
  });
  
}

  else     return res.status(404).json(error(404, "type Not Found"));

   
    if (!hff) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("201", hff, "done"));
  } catch (err) {console.log(err)
    res.status(500).json(error(500, err));
  }
};
module.exports = {
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  userChangePassword,
  addFavorite,
  removeFavorite
};

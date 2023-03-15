let jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { success, error } = require("../../../utiles/responser");
let bcrypt = require("bcryptjs");
const { PrismaClient, Prisma } = require("@prisma/client");
const { User, role, setting, Favorite, dr, hf } = new PrismaClient();
var moment = require('moment-timezone');
moment().tz('Asia/Baghdad').format();
const getAllUser = async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);
  try {
    const count = await User.count();

    if (!count > 0) return res.status(404).json("empty");

    let sizes = 2;
    let pages = 1;
    if (!Number.isNaN(size) && size > 0 && size <= 10) sizes = size;
    if (!Number.isNaN(page) && page > 0) pages = page;
    let nPage = Math.ceil(count / sizes);
    if (pages > nPage) pages = nPage;
    const user = await User.findMany({
      skip: (pages - 1) * sizes,
      take: sizes,
      include: {
        setting: true,
        role: true,
        address: true,
        favoritedr: true,
        favoritehf: true,
      },
    });
    console.log("SdSD", sizes, pages, nPage);
    res.json(success(`current_page: ${pages}`, user, `TOTAL PAGES ${nPage}`));
  } catch (errorr) {
    console.log(errorr);
    return res.status(500).json(error(500, errorr));
  }
};
const getUser = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }
  console.log(req.user);
  try {
    let user;
    if (req.user.id == req.params.id || req.user.roleName == "superadmin") {
      user = await User.findUnique({
        where: { id: req.params.id },
        include: {
          setting: true,
          role: true,
          address: true,
          favoritedr:{include :{user: { include: { address:true,setting: true, role: true }} } },
          
          favoritehf: {include :{user: { include: { address:true,setting: true, role: true }} } },
        },
      });
    }  if (!user) {
      return res.status(404).json(error(404, "Not Found"));
    }
    if (user.role.name == "superadmin")
      return res.status(404).json(error(404, "you dont have permission"));
  
    res.json(success("200", user, "sdas"));
  } catch (e) {
    console.log("ewaweaw", e);
  }
};

const updateUser = async (req, res) => {
  const { name, avatar, dob, gender, language, darkmode, bio, city, town } =
    req.body;

  try {
    let user;
    if (req.user.id == req.params.id || req.user.roleName == "superadmin")
      user = await User.findUnique({
        where: { id: req.params.id },
        include: { role: true },
      });

    if (!user) {
      return res.status(404).json(error(404, "Not Found"));
    }
    if (user.role.name == "superadmin")
      return res.status(404).json(error(404, "you dont have permission"));

    user = await User.update({
      where: { id: req.params.id },
      include: { setting: true, role: true, address: true },

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

    res.json(user);
  } catch (err) {
    res.status(500).json(error(500, err));
  }
};
const deleteUser = async (req, res) => {
  try {
    let user;
    if (req.user.id == req.params.id || req.user.roleName == "superadmin") {
      user = await User.findUnique({
        where: { id: req.params.id },
        include: { role: true },
      });
      if (user.role.name == "superadmin")
        return res.status(404).json(error(404, "you dont have permission"));
    }
    console.log(user)
    if (!user) {
      return res.status(404).json(error(404, "Not Found"));
    }
    user = await User.delete({
      where: {
        id: req.params.id,
      },
      include: {
        setting: true,
        role: true,
        address: true,
        favoritedr: true,
        favoritehf: true,
      },
    });
    // if(user.role.name=="dr")
    // await dr.delete({where:{id:}})

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
  let user;
  if (req.user.id == req.params.id || req.user.roleName == "superadmin") {
    user = await User.findUnique({
      where: { id: id },
      include: { role: true },
    });
  }
  if (!user) {
    return res.status(404).json(error(404, "Not Found"));
  }
  if (user.role.name == "superadmin")
    return res.status(404).json(error(404, "you dont have permission"));
  let ok = await bcrypt.compare(oldpass, user.password);
  if (ok) {
    const hashedPassword = await bcrypt.hashSync(req.body.password, 10);
    try {
      user = await User.update({
        data: { password: hashedPassword },
        where: { id: id },
      });

      res.json({ user });
    } catch (err) {
      console.log(err);
      res.status(500).json(error(500, err));
    }
  } else res.status(500).json(error(500, "wrong password"));
};
const addFavorite = async (req, res) => {
  try {
    let { idDr, idUser } = req.body;
    let type = req.body.type;
    let drr;
    let hff;
    if (type == "dr") {
      drr = await dr.findFirst({ where: { id: idDr },include:{ user: { include: { address:true,setting: true, role: true }}} });
      if (!drr) return res.status(404).json(error(404, "Not Found"));
      if (req.user.id == idUser || req.user.roleName == "superadmin")
        hff = await User.update({
          where: { id: idUser },
          data: {
            favoritedr: {
              connect: { id: drr.id },
            },
          },
        });
    } else if (type == "hf") {
      drr = await hf.findFirst({ where: { id: idDr } });
      if (!drr) return res.status(404).json(error(404, "Not Found"));
      if (req.user.id == idUser || req.user.roleName == "superadmin")
        hff = await User.update({
          where: { id: idUser },
          data: {
            favoritehf: {
              connect: { id: drr.id },
            },
          },
        });
    } else return res.status(404).json(error(404, "type Not Found"));

    if (!hff) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("201", hff,drr, "done"));
  } catch (err) {
    console.log(err);
    res.status(500).json(error(500, err));
  }
};
const removeFavorite = async (req, res) => {
  try {
    let { idDr, idUser } = req.body;
    let type = req.body.type;
    let drr;
    let hff;
    if (type == "dr") {
      drr = await dr.findFirst({ where: { id: idDr } });
      if (!drr) return res.status(404).json(error(404, "Not Found"));
      if (req.user.id == idUser || req.user.roleName == "superadmin")
        hff = await User.update({
          where: { id: idUser },
          data: {
            favoritedr: {
              disconnect: { id: drr.id },
            },
          },
        });
    } else if (type == "hf") {
      drr = await hf.findFirst({ where: { id: idDr } });
      if (!drr) return res.status(404).json(error(404, "Not Found"));
      if (req.user.id == idUser || req.user.roleName == "superadmin")
        hff = await User.update({
          where: { id: idUser },
          data: {
            favoritehf: {
              disconnect: { id: drr.id },
            },
          },
        });
    } else return res.status(404).json(error(404, "type Not Found"));

    if (!hff) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("201", hff, "done"));
  } catch (err) {
    console.log(err);
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
  removeFavorite,
};

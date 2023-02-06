let jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { success, error } = require("../../utiles/responser");
let bcrypt = require("bcryptjs");
const { PrismaClient, Prisma } = require("@prisma/client");
const { User, role, setting } = new PrismaClient();

const getAllUser = async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);
  const count = await User.count();
  let sizes = 2;
  let pages = 1;
  if (!Number.isNaN(size) && size > 0 && size <= 10) sizes = size;
  if (!Number.isNaN(page) && page > 0) pages = page;
  let nPage = Math.ceil(count / sizes);
  if (pages > nPage) pages = nPage;
  const user = await User.findMany({
    skip: (pages - 1) * sizes,
    take: sizes,
    include: { setting: true, role: true },
  });
  console.log("SdSD", sizes, pages, nPage);
  res.json(success(`current_page: ${pages}`, user, `TOTAL PAGES ${nPage}`));
};
// const getUser = async (req, res) => {
//   let errors = validationResult(req).array();
//   if (errors && errors.length > 0) {
//     return res.status(400).json(error(400, errors));
//   }
//   try {
//     const user = await User.findUnique({
//       where: { id: req.params.id },
//       include: { setting: true, role: true },
//     });
//     if (!user) {
//       return res.status(404).json(error(404, "Not Found"));
//     }
//     res.json(success("200", user, "sdas"));
//   } catch (e) {
//     console.log("ewaweaw", e);
//   }
// };
const updateUser = async (req, res) => {
  const { name, avatar, dob, gender, language, darkmode, bio } = req.body;

  try {
    const user = await User.update(
      {
        data: { name },
        setting: { avatar, dob, gender, bio, language, darkmode },
      },
      {
        where: { id: req.params.id },
      }
    );
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
    });
    let setting = await setting.delete({
      where: {
        userId: req.params.id,
      },
    });
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

module.exports = {
  getAllUser,
  //getUser,
  updateUser,
  deleteUser,
  userChangePassword,
};

let jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { success, error } = require("../../utiles/responser");
let bcrypt = require("bcryptjs");
const { PrismaClient, Prisma } = require("@prisma/client");
const { hf, role, settingHf } = new PrismaClient();

const getAllFacility = async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);
  const count = await hf.count();
  let sizes = 2;
  let pages = 1;
  if (!Number.isNaN(size) && size > 0 && size <= 10) sizes = size;
  if (!Number.isNaN(page) && page > 0) pages = page;
  let nPage = Math.ceil(count / sizes);
  if (pages > nPage) pages = nPage;
  const facilities = await hf.findMany({
    skip: (pages - 1) * sizes,
    take: sizes,
    include: { settingHf: true, role: true },
  });
  console.log("SdSD", sizes, pages, nPage);
  res.json(success(`current_page: ${pages}`, facilities, `TOTAL PAGES ${nPage}`));
};
const getFacility = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }
  try {
    const facilities = await hf.findUnique({
      where: { id: req.params.id },
      include: { settingHf: true, role: true },
    });
    if (!facilities) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("200", facilities, "sdas"));
  } catch (e) {
    console.log("ewaweaw", e);
  }
};
const updateFacility = async (req, res) => {
  const { name, avatar, dob, gender, language, darkmode, description,cost,city,town } = req.body;

  try {
    const facilities = await hf.update(
      {
        data: { name },
        settingHf: { avatar, dob, gender, description, language, darkmode,cost },
        address:{city,town}
      },
      {
        where: { id: req.params.id },
      }
    );
    if (facilities > 0) {
      return res.status(404).json(error(404, "Not Found"));
    }

    res.json(facilities);
  } catch (err) {
    res.status(500).json(error(500, err));
  }
};
const deleteFacility = async (req, res) => {
  try {
    let fcility = await hf.delete({
      where: {
        id: req.params.id,
      },    include: { settingHf: true, role: true },

    });
    if (!fcility) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("201", fcility, "deleted"));
  } catch (err) {
    res.status(500).json(error(500, err));
  }
};

const facilityChangePassword = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }
  const { id, oldpass } = req.body;
  const fcility = await hf.findUnique({ where: { id: id } });
  if (!fcility) {
    return res.status(404).json(error(404, "Not Found"));
  }
  let ok = await bcrypt.compare(oldpass, user.password);
  if (ok) {
    const hashedPassword = await bcrypt.hashSync(req.body.password, 10);
    try {
      await hf.update({ password: hashedPassword }, { where: { id: id } });

      res.json({ fcility });
    } catch (err) {
      res.status(500).json(error(500, err));
    }
  } else res.status(500).json(error(500, "wrong password"));
};

module.exports = {
    getAllFacility,
    getFacility,
  updateFacility,
  deleteFacility,
  facilityChangePassword,
};

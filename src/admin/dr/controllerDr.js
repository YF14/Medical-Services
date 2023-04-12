let jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { success, error } = require("../../../utiles/responser");
let bcrypt = require("bcryptjs");
const { PrismaClient, Prisma } = require("@prisma/client");
const { dr, User, role, setting, address, Specialties } = new PrismaClient();

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
      cost,
      openAt,
      closeAt,
      xp,
      magerSpecialties,rating
    } = req.body;
    const drr = await dr.create({
      data: {
        description,
        closeAt,
        openAt,
        cost,
        xp,
        magerSpecialties,
        rating,
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
    res.json(success(201, drr, "new user "));
  } catch (err) {
    console.log(err);
    res.status(500).json(error(500, err));
  }
};
const getAllDr = async (req, res) => {
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
    const drr = await dr.findMany({
      skip: (pages - 1) * sizes,
      take: sizes,
      include: {
        user: { include: { setting: true, role: true, address: true } },
        specialties: true,
      },
    });
    console.log("SdSD", sizes, pages, nPage);
    res.json(success(`current_page: ${pages}`, drr, `TOTAL PAGES ${nPage}`));
  } catch (errorr) {
    console.log(errorr);
    return res.status(500).json(error(500, errorr));
  }
};
const getAllDrSameSpec = async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);
  try {
    const count = await dr.count();
    const { name } = req.body;
    if (!count > 0) return res.status(404).json("empty");

    let sizes = 2;
    let pages = 1;
    if (!Number.isNaN(size) && size > 0 && size <= 10) sizes = size;
    if (!Number.isNaN(page) && page > 0) pages = page;
    let nPage = Math.ceil(count / sizes);
    if (pages > nPage) pages = nPage;
    const drr = await Specialties.findMany({
      where: { name },
      skip: (pages - 1) * sizes,
      take: sizes,
      include: {
        dr: {
          include: {
            user: { include: { setting: true, role: true, address: true } },
            specialties: true,
          },
        },
      },
    });
    console.log("SdSD", sizes, pages, nPage);
    res.json(success(`current_page: ${pages}`, drr, `TOTAL PAGES ${nPage}`));
  } catch (errorr) {
    console.log(errorr);
    return res.status(500).json(error(500, errorr));
  }
};
const getAllDrByRating = async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);
  try {
    const count = await dr.count();
    if (!count > 0) return res.status(404).json("empty");
    const { name } = req.body;

    let sizes = 2;
    let pages = 1;
    if (!Number.isNaN(size) && size > 0 && size <= 10) sizes = size;
    if (!Number.isNaN(page) && page > 0) pages = page;
    let nPage = Math.ceil(count / sizes);
    if (pages > nPage) pages = nPage;
    const drr = await dr.findMany({
      where: { specialties:{some:{name:{in:name}}} },

      orderBy: {rating:{ sort: 'desc', nulls: 'last' }},
      skip: (pages - 1) * sizes,
      take: sizes,
      include: {
        user: { include: { setting: true, role: true, address: true } },
        specialties: true,
      },
    });
    console.log("SdSD", sizes, pages, nPage);
    res.json(success(`current_page: ${pages}`, drr, `TOTAL PAGES ${nPage}`));
  } catch (errorr) {
    console.log(errorr);
    return res.status(500).json(error(500, errorr));
  }
};
const getAllDrByGender = async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);
  try {
    const count = await dr.count();
    if (!count > 0) return res.status(404).json("empty");
    const { name } = req.body;

    let sizes = 2;
    let pages = 1;
    if (!Number.isNaN(size) && size > 0 && size <= 10) sizes = size;
    if (!Number.isNaN(page) && page > 0) pages = page;
    let nPage = Math.ceil(count / sizes);
    if (pages > nPage) pages = nPage;
    const drr = await dr.findMany({
where:{user:{setting:{gender:req.body.gender}},specialties:{some:{name:{in:name}}}}
,      skip: (pages - 1) * sizes,
      take: sizes,
      include: {
        user: { include: { setting: true, role: true, address: true } },
        specialties: true,
      },
    });
    console.log("SdSD", sizes, pages, nPage);
    res.json(success(`current_page: ${pages}`, drr, `TOTAL PAGES ${nPage}`));
  } catch (errorr) {
    console.log(errorr);
    return res.status(500).json(error(500, errorr));
  }
};
const getAllDrByCost = async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);
  try {
    const count = await dr.count();
    if (!count > 0) return res.status(404).json("empty");
let {name}=req.body
    let sizes = 2;
    let pages = 1;
    if (!Number.isNaN(size) && size > 0 && size <= 10) sizes = size;
    if (!Number.isNaN(page) && page > 0) pages = page;
    let nPage = Math.ceil(count / sizes);
    if (pages > nPage) pages = nPage;
    console.log("Test")
let type =req.body.type
 console.log(type)
    const drr = await dr.findMany({ 
    where:{ specialties:{some:{name:{in:name}}}},
      orderBy: {cost:type=="high"?Prisma.SortOrder.desc:Prisma.SortOrder.asc },

      skip: (pages - 1) * sizes,
      take: sizes,
      include: {
        user: { include: { setting: true, role: true, address: true } },
        specialties: true,
      },
    });
    console.log("SdSD", sizes, pages, nPage);
    res.json(success(`current_page: ${pages}`, drr, `TOTAL PAGES ${nPage}`));
  } catch (errorr) {
    console.log(errorr);
    return res.status(500).json(error(500, errorr));
  }
};
const getDr = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }
  try {
    const drr = await dr.findUnique({
      where: { id: req.params.id },
      include: {
        user: { include: { setting: true, role: true, address: true } },
        specialties: true,
      },
    });
    if (!drr) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("200", drr, "sdas"));
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
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);
  let user = await User.findFirst({where:{id:req.user.id},include:{address:true}})
  if (!user) 
  return res.status(404).json(error(404, "Not Found"));

  try {
    const count = await dr.count();
    if (!count > 0) return res.status(404).json("empty");

    let sizes = 2;
    let pages = 1;
    if (!Number.isNaN(size) && size > 0 && size <= 10) sizes = size;
    if (!Number.isNaN(page) && page > 0) pages = page;
    let nPage = Math.ceil(count / sizes);
    if (pages > nPage) pages = nPage;
    const drr = await dr.findMany({
      where:{user:{address:{city:user.address.city}}},
      skip: (pages - 1) * sizes,
      take: sizes,
      include: {
        user: { include: { setting: true, role: true, address: true } },
        specialties: true,
      },
    });
    console.log("SdSD", sizes, pages, nPage);
    res.json(success(`current_page: ${pages}`, drr, `TOTAL PAGES ${nPage}`));
  } catch (errorr) {
    console.log(errorr);
    return res.status(500).json(error(500, errorr));
  }
};
const getDrName = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }
  try {
    const drr = await dr.findFirst({
      where: { name: req.body.name },
      include: {
        include: {
          user: { include: { address: true, setting: true, role: true } },
        },
      },
    });
    if (!drr) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("200", drr, "done"));
  } catch (err) {
    console.log("ewaweaw", err);
    return res.status(500).json(error(500, "server side error"));
  }
};
const updateDr = async (req, res) => {
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
    magerSpecialties,
    rating
  } = req.body;

  try {
    const drr = await dr.update({
      where: { id: req.params.id },
      include: {
        dr: {
          include: {
            user: { include: { address: true, setting: true, role: true } },
          },
        },
      },

      data: {
        description,
        closeAt,
        openAt,
        cost,
        xp,
        magerSpecialties,
        rating,
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
    res.json(drr);
  } catch (err) {
    console.log(err);
    res.status(500).json(error(500, err));
  }
};
const deleteDr = async (req, res) => {
  try {
    let drr = await dr.delete({
      where: {
        id: req.params.id,
      },
      include: {
        dr: {
          include: {
            user: { include: { address: true, setting: true, role: true } },
          },
        },
      },
    });
    if (!drr) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("201", drr, "deleted"));
  } catch (err) {
    res.status(500).json(error(500, err));
  }
};

const addSpecialties = async (req, res) => {
  try {
    let name = req.body.name;

    let spec = await Specialties.findMany({ where: { name: { in: name } } });
    console.log(spec);
    if (!spec) return res.status(404).json(error(404, "Not Found"));

    let id = req.body.id;
    const hff = await dr.update({
      where: { id },
      data: {
        specialties: {
          connect: spec.map((c) => ({ id: parseInt(c.id) })),
        },
      },
    });

    if (!hff) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("201", hff, "done"));
  } catch (err) {
    console.log(err);
    res.status(500).json(error(500, err));
  }
};

const changeAvailable = async (req, res) => {
  try {
    let id = req.body.id;
    let drr = await dr.findUnique({ where: { id } });
    if (!drr) return res.status(404).json(error(404, "Not Found"));
    drr = await dr.update({
      where: { id },
      data: {
        isAvailable: req.body.available,
      },
    });

    if (!drr) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("201", drr, "done"));
  } catch (err) {
    console.log(err);
    res.status(500).json(error(500, err));
  }
};
module.exports = {
  getAllDr,
  getDr,
  updateDr,
  deleteDr,
  signup,
  addSpecialties,
  getAllDrSameSpec,
  getDrName,
  changeAvailable,
  getNearMe,
  getAllDrByRating,
  getAllDrByGender,
  getAllDrByCost
};

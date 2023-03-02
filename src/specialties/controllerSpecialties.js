let jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { success, error } = require("../../utiles/responser");
let bcrypt = require("bcryptjs");
const { PrismaClient, Prisma } = require("@prisma/client");
const { Specialties } = new PrismaClient();

const addSpecialties = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }

  try {
   

    const {name} = req.body;
    const spec = await Specialties.create({
      data: {
      name}
    });
    res.json(success(201, spec, "new Specialties "));
  } catch (err) {
    console.log(err);
    res.status(500).json(error(500, err));
  }
};
const getAllSpecialties = async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);
  try {
    const count = await Specialties.count();
  
  if(!count>0)
  return res.status(404).json("empty");

  let sizes = 2;
  let pages = 1;
  if (!Number.isNaN(size) && size > 0 && size <= 10) sizes = size;
  if (!Number.isNaN(page) && page > 0) pages = page;
  let nPage = Math.ceil(count / sizes);
  if (pages > nPage) pages = nPage;
  const spec = await Specialties.findMany({
    skip: (pages - 1) * sizes,
    take: sizes,
   
  });
  console.log("SdSD", sizes, pages, nPage);
  res.json(success(`current_page: ${pages}`, spec, `TOTAL PAGES ${nPage}`));
} catch (errorr) {console.log(errorr)
  return res.status(500).json(error(500, errorr));

}};
const getSpecialties = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }
  let id =req.params.id
  try {
    const spec = await Specialties.findUnique({
      where: { id:parseInt(id)},
     
    });
    if (!spec) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("200", spec, "sdas"));
  } catch (err) {
    console.log("ewaweaw", err);
    return res.status(500).json(error(500, "server side error"));
  }
};
const updateSpecialties = async (req, res) => {
  const {
    name,
    
  } = req.body;

  try {  let id =req.params.id

    const spec = await Specialties.update({where:{id:parseInt(id)},
   

      data: {
       name,}
    });
    res.json(spec);
  } catch (err) {
    console.log(err);
    res.status(500).json(error(500, err));
  }
};
const deleteSpecialties = async (req, res) => {
  try {  let id =req.params.id
    let spec = await Specialties.delete({
      where: {
        id:parseInt(id)
      },
     
    });
    if (!spec) {
      return res.status(404).json(error(404, "Not Found"));
    }
    res.json(success("201", spec, "deleted"));
  } catch (err) {
    res.status(500).json(error(500, err));
  }
};

module.exports = {
  getAllSpecialties,
  getSpecialties,
  updateSpecialties,
  deleteSpecialties,
  addSpecialties,
};

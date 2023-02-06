let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const { success, error } = require("../../utiles/responser");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const REFREASHJWT_SECRET_KEY = process.env.REFREASHJWT_SECRET_KEY;
const {User} = new PrismaClient();

const signup =async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }

  try {
    const hashedPassword = await bcrypt.hashSync(req.body.password, 10);

    const {email, name, roleName, avatar, bio, dob, gender,street,city} = req.body;
    const user = await User.create({
      data: {
        email,
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
        address:{
          create :{
            city,
            street
          }
        }
      },
    });
    res.json(success(201,user,"new user "));
  } catch (err) {
    console.log(err);
    res.status(500).json(error(500, err));
  }
};

const signin = async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }
  let email = req.body.email;
  console.log(email);
  try {
    let user = await User.findUnique({
      where: {
        email
      },
      include:{role: true},
    });
    console.log(user);
    if (!user) {
      return res.status(404).json(error(404, "Not Found"));
    }
    let rol = user.role;
    if (rol.name === "admin" && !rol.isActive) {
      return res.status(404).json(error(400, "your status is disable"));
    }
    let ok = await bcrypt.compare(req.body.password, user.password);
    if (!ok) return res.status(401).json(error(401, "Invalid Password"));
    let token = jwt.sign(
      {
        displayName: user.name,
        id: user.id,
        accessToken: "",
        renewalToken: "",
        token_type: "bearer",
      },
      JWT_SECRET_KEY,
      {
        expiresIn: 3600, // 1 hour
      }
    );
    let refreshToken = jwt.sign(
      {
        displayName: user.name,
        id: user.id,
        accessToken: "",
        renewalToken: "",
        token_type: "bearer",
      },
      REFREASHJWT_SECRET_KEY,
      {
        expiresIn: 7200, 
      }
    );

    return res.status(200).json(
      success(
        200,
        {
        
          displayName: user.name,
          accessToken: token,
          renewalToken: refreshToken,
          token_type: "bearer",
        },
        "welcome back"
      )
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(error(500, "Server Side Error"));
  }
};
module.exports = { signup, signin };

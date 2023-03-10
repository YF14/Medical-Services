let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const { success, error } = require("../../../utiles/responser");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const REFREASHJWT_SECRET_KEY = process.env.REFREASHJWT_SECRET_KEY;
const {User,Otp} = new PrismaClient();
const accountSid = "AC79a2c45010916630b4cdb5d26cef6f34";
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = "VA8c0dbbdd0f46ff2143ecc9c8dae8fa5d";
const client = require("twilio")(accountSid, authToken);
var moment = require('moment-timezone');
moment().tz('Asia/Baghdad').format();
const signup =async (req, res) => {
  let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }

  try {
    const hashedPassword = await bcrypt.hashSync(req.body.password, 10);

    const {phoneNumber, name, roleName, avatar, bio, dob, gender,town,city} = req.body;
    const user = await User.create({
      data: {
        phoneNumber,
        name,
        password: hashedPassword,
        role: {
          create: { name: roleName },
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
            town
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
  let phoneNumber = req.body.phoneNumber;
  console.log(phoneNumber);
  try {
    let user = await User.findUnique({
      where: {
        phoneNumber
      },
      include:{role:true,dr:true,hf:true},
    });
    console.log(user);
    if (!user) {
      return res.status(404).json(error(404, "Not Found"));
    }
    console.log("user:",user)
    let rol = user.role;
    if (rol.name === "superadmin" && !rol.isActive) {
      return res.status(404).json(error(400, "your status is disable"));
    }
    let ok = await bcrypt.compare(req.body.password, user.password);
    if (!ok) return res.status(401).json(error(401, "Invalid Password"));
    let token = jwt.sign(
      { roleName:user.role.name,
        displayName: user.name,
        id: user.id,
        isVerify:user.role.isVerify,
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
      { roleName:user.role.name,
        displayName: user.name,
        id: user.id,
        isVerify:user.role.isVerify,
        accessToken: "",
        renewalToken: "",
        token_type: "bearer",
      },
      REFREASHJWT_SECRET_KEY,
      {
        expiresIn: 7200, 
      }
    );
    let ID=0
    if(user.role.name=="dr")
    ID=user.dr.id
    else if(user.role.name=="hf")
    ID=user.hf.id
    return res.status(200).json(
      success(
        200,
        { drIdOrHfId:ID,
          id:user.id,
          verify:user.role.isVerify,
          roleName:user.role.name,
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

const getOtp = async (req, res) => {
  var exp,timeOut=moment()
  try { const {phoneNumber } = req.body;
  const OTP = `${Math.floor(1000 + Math.random() * 9000)}`;
let otp;
let user = await User.findFirst({
  where:{ phoneNumber:req.body.phoneNumber},
select:{id:true}
});
console.log("Adsa",moment().valueOf())
if (!user) {
return res.status(404).json(error(404, "Not Found"));
}
   otp = await Otp.findFirst({where:{User:{some:{phoneNumber}}}
  ,include :{User:true}})
  console.log(otp,"ffff"); 
  if(!otp){
   otp = await Otp.create({
    data:{
    User:{connect:{id:user.id}}, 
    otp:parseInt(OTP), 
    exp:moment(exp).add(180, 's').format(),
       timeOut:moment(timeOut).add(30, 's').format()
    
  }});
  client.messages
    .create({body:OTP, from: '+1 567 313 1123', to: phoneNumber})
    .then(message => console.log(message.sid));
    return res.status(200).json(success(200,otp, "done"));

  }
  console.log(otp); 
  console.log(otp.timeOut.valueOf(),"diff",moment().valueOf()); 

  if((otp.timeOut.valueOf() > moment().valueOf())){
      return res.status(500).json(error(500, "timeOut"));
  } 
 if(otp){
      otp = await Otp.update({where:{id:otp.id},
       data:{
       otp:parseInt(OTP),
       exp:moment(exp).add(180, 's').format(),
       timeOut:moment(timeOut).add(30, 's').format()
       
     }});}
     client.messages
    .create({body:OTP, from: '+1 567 313 1123', to: phoneNumber})
    .then(message => console.log(message.sid));
   return res.status(200).json(success(200,otp, "done"));
    
   
    
        

     } catch (err) {
    console.log(err);
    return res.status(500).json(error(500, "Server Side Error"));
  }
};

const verifyOTP = async (req, res) => {
   let errors = validationResult(req).array();
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }
  try {
    const {OTP,phoneNumber } = req.body;
  let userr = await User.findUnique({where:{phoneNumber},include:{role:true,otp:true}})
console.log(userr)
    if (!userr.otp||userr.otp.exp.valueOf() < moment().valueOf())
      return res
        .status(400)
        .json(error(400, "your otp is expired or didn't exist ,make new one ")); 
if(req.body.type=="forget")
{if (OTP == userr.otp.otp)
{      return res.status(200).json(success(200, "true"));


}
else return res.status(401).json(error(401, "wrong otp"));

}
else if (req.body.type=="verify")
    if (OTP == userr.otp.otp) {
      console.log(userr.otp);
      let rol = await User.update(
        {data:{
         role:{update:{ isVerify: true,}}
         
        }
          ,
        
        
          where: {id:userr.id },
        }
      );
      
      return res.status(201).json(success(200, { rol }));
    } else return res.status(401).json(error(401, "wrong "));
  } catch (err) {
    console.error(err);
    return res.status(500).json(error(500, "Server Side Error"));
  }
};
const forgetPassword = async (req, res) => {
  let errors = validationResult(req).array();
  
  if (errors && errors.length > 0) {
    return res.status(400).json(error(400, errors));
  }
  const { phoneNumber,OTP} = req.body;
  let user = await User.findUnique({
      where: { phoneNumber: phoneNumber },
      include: { role: true ,otp:true},
    })
  
  if (!user) {
    return res.status(404).json(error(404, "Not Found"));
  }
  if (user.role.name == "superadmin")
    return res.status(401).json(error(401, "you dont have permission"));
   {
    const hashedPassword = await bcrypt.hashSync(req.body.password, 10);
    try {
      user = await User.update({
        data: { password: hashedPassword },
        where: { phoneNumber: phoneNumber },
      });

      res.json({ user });
    } catch (err) {
      console.log(err);
      res.status(500).json(error(500, err));
    }
  } 
};
const refreshToken = async (req, res)=>{
  let tokenn = req.body.tokenn
        if (!tokenn) {
        return res.status(403).send("A refresh token is required for authentication");
      } 
      let decoded
      try {   
       decoded = jwt.verify(tokenn,REFREASHJWT_SECRET_KEY);
       console.log(decoded)

    } catch (err) {
      return res.status(401).send(err);
    }        


      let token = jwt.sign(
        { roleName:decoded.roleName,
          displayName: decoded.name,
          id: decoded.id,
          isVerify:decoded.isVerify,
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
        { roleName:decoded.roleName,
          displayName: decoded.name,
          id: decoded.id,
          isVerify:decoded.isVerify,
          accessToken: "",
          renewalToken: "",
          token_type: "bearer",
        },
        REFREASHJWT_SECRET_KEY,
        {
          expiresIn: 7200, 
        }
      );
     
       res.status(200).json(success(200,{
        id:decoded.id,
        verify:decoded.isVerify,
        roleName:decoded.roleName,
        displayName: decoded.name,
        accessToken: token,
        renewalToken: refreshToken,
        token_type: "bearer",
          
      },"welcome back"))
  }  
      
module.exports = { signup, signin,getOtp,verifyOTP ,forgetPassword,refreshToken};


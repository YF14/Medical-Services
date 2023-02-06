const { success, error } = require("../../utiles/responser");
const { PrismaClient } = require('@prisma/client')
const {User} = new PrismaClient()

const checkUserDuplicate = async (req,res, next)=>{
    let user = await User.findUnique({
        where:{
        email:req.body.email
}})
    if(user)
    {
        return res.status(409).json(error(409,"User already exists"))
    }
    next();
}



module.exports = {checkUserDuplicate}
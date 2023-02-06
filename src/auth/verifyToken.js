const { success, error } = require("../../utiles/responser");
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const {User} = new PrismaClient()

  
const checkUserDuplicate = async (req,res, next)=>{
 
   
    
        try { let user = await User.findUnique({
        where:{
        id:req.params.id
        }})
            
           if(user)
            {
               next(); 
               return
            }
    
         return res.status(404).json(error(404,"not found"))
        } catch (err) {
            console.error(err)
            return res.status(500).json(error(500,"Server Side Error"))
     
        }
}
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const verifyToken = async (req, res, next)=>{
    let token = req.headers['authorization']
      if (!token) {
        return res.status(403).send("A token is required for authentication");
      }
      try {token=token.split(' ')[1]
        const decoded = jwt.verify(token,JWT_SECRET_KEY);
        req.user = decoded;
      } catch (err) {
        return res.status(401).send(err);
      }
      return next();
    };
    

module.exports = {checkUserDuplicate,verifyToken}
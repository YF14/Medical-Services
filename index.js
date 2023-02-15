const express = require('express');
const app = express()
require('dotenv').config()

const APP_PORT = process.env.APP_PORT;
const authRoute=require('./src/auth/authRoute')
const userRoute=require('./src/user/userRoute')
const drRoute =require ('./src/dr/routeDr')
app.use(express.json())
// call routers
app.use("/auth",authRoute )
app.use("/user",userRoute )
app.use("/dr",drRoute )
app.listen(APP_PORT)    
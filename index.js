const express = require('express');
const app = express()
require('dotenv').config()
const cors = require('cors')

const APP_PORT = process.env.APP_PORT;
const authRoute=require('./src/auth/authRoute')
const userRoute=require('./src/user/userRoute')
const drRoute =require ('./src/dr/routeDr')
const hfRoute =require ('./src/hf/routeHf')
const SpecialtiesRoute =require ('./src/Specialties/routeSpecialties')

app.use(express.json())
app.use(cors())

// call routers
app.use("/auth",authRoute )
app.use("/user",userRoute )
app.use("/dr",drRoute)
app.use("/hf",hfRoute)
app.use("/Specialties",SpecialtiesRoute)
app.listen(APP_PORT)    
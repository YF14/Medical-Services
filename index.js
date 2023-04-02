const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const APP_PORT = process.env.APP_PORT;
const authRoute = require("./src/admin/auth/authRoute");
const userRoute = require("./src/admin/user/userRoute");
const drRoute = require("./src/admin/dr/routeDr");
const hfRoute = require("./src/admin/hf/routeHf");
const SpecialtiesRoute = require("./src/admin/specialties/routeSpecialties");
const bookingRoute = require("./src/admin/booking/routeBooking");
//////////
// const userRouteMobile = require("./src/mobile/user/userRoute");
// const drRouteMobile = require("./src/mobile/dr/routeDr");
// const hfRouteMobile = require("./src/mobile/hf/routeHf");
// const bookingRouteMobile = require("./src/mobile/booking/routeBooking");

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("<h1>This is Clinic Restful API</h1>");
});

// call routers
app.use("/admin/auth", authRoute);
app.use("/admin/user", userRoute);
app.use("/admin/dr", drRoute);
app.use("/admin/hf", hfRoute);
app.use("/admin/Specialties", SpecialtiesRoute);
app.use("/admin/booking", bookingRoute);
// /////
// app.use("/mobile/user", userRouteMobile);
// app.use("/mobile/dr", drRouteMobile);
// app.use("/mobile/hf", hfRouteMobile);
// app.use("/mobile/booking", bookingRouteMobile);

app.listen(APP_PORT);

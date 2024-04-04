const express = require("express")
const passport = require("passport");
const session = require("express-session");
const morgan = require("morgan")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()
const cors = require("cors")

const userRouter = require("./routes/userRouter");

const app = express();




app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept"
  );
  res.setHeader("Cache-Control", "no-store");
  next();
});




app.use(express.json());
app.use(morgan("dev"));

// app.use(cors());
// Access-Control-Allow-Origin *
// api.natours.com, front-end natours.com
// app.use(cors({
//   origin: 'https://adsynth-ai.netlify.app'
// }))

app.use(cors())
app.options("*", cors());


const connectToMongoDb = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDb.."))
    .catch((error) => {
      console.log("Error in connecting to mongoDB " + error);
      throw error;
    });
};
connectToMongoDb();

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});




const port = process.env.PORT || 5000



process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});

app.use("/api/v1/user", userRouter)

app.all("*", (req, res, next) => {
  return res.status(404).json({message: `Can't find ${req.originalUrl} on this server!`});
});




app.listen(port, ()=>{
    console.log(`Adsynth Server Listening at port ${port}`)
})
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingRoute = require("./routes/listing");
const reviewRoute = require("./routes/review");
const userRoute = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const { listingSchema } = require("./schema.js");
const ExpressError = require("./ExpressError.js");
const { error } = require("console");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const dbUrl = process.env.ATLASDB;
main()
  .then((res) => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //It is basically used for prevention of crossscripting attack.
  },
};
store.on("error", () => {
  console.log("Erro in mongodb", err);
});
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curUser = req.user;
  next();
});
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

// const wrapAsync = require("./utils/wrapAsync");

//demo User
app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "malik@gmail.com",
    username: "malik",
  });
  let registeredUser = await User.register(fakeUser, "maliksab");
  res.send(registeredUser);
});
app.use("/listings", listingRoute);
app.use("/listings/:id/review", reviewRoute);
app.use("/user", userRoute);

// const wrapAsync = (fn) => {
//   return function (req, res, next) {
//     fn(req, res, next).catch((err) => {
//       next(err);
//     });
//   };
// };

// app.get("/testlisting", async (req, res) => {
//   let firstListing = new Listing({
//     title: "Isnaan's Restuarent",
//     description: "Enjoy the best one",
//     image: "",
//     price: 1500,
//     location: "sawat",
//     country: "Pakistan",
//   });
//   await firstListing.save().then((res) => {
//     console.log("First sample was saved");
//   });
//   res.send("Successfully testing");
// });

// MIDDLEWARE
// app.use((err, req, res, next) => {
//   res.send("Something went wrong");
// });

app.listen(port, () => {
  console.log(`The app is listening on port ${port}`);
});

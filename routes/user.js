const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const userControllers = require("../controllers/users.js");
// const url = require("../middleware.js");

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}; //While writing this piece of code in middleware.js i got an error.Soi have write here

router
  .route("/signup")
  .get(userControllers.signupform)
  .post(userControllers.signup);

router
  .route("/login")
  .get(userControllers.loginform)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/user/login",
      failureFlash: true,
    }),
    userControllers.login
  );
// router.get("/signup", userControllers.signupform);
// router.post("/signup", userControllers.signup);
// router.get("/login", userControllers.loginform);

// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/user/login",
//     failureFlash: true,
//   }),
//   userControllers.login
// );

router.get("/logout", userControllers.logout);
module.exports = router;

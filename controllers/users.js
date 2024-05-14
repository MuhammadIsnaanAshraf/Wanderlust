const User = require("../models/user");

module.exports.signupform = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to wanderlsut!");
      res.redirect("/listings");
    });
  } catch (error) {
    console.log(error);
    req.flash("error", error.message);
    res.redirect("/user/signup");
  } //Error part not working because we have not  work on error key in flash.
};

module.exports.loginform = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to wonderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      // console.log(err.message);
      next(err);
    }
    req.flash("success", "You logged out successfully");
    res.redirect("/listings");
  });
};

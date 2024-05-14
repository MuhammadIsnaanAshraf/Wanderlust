// const Listing = require("./models/listings");
module.exports = isLogedin = (req, res, next) => {
  // console.log(req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("success", "please login before performing any operation ");
    return res.redirect("/user/login");
  }
  // else {
  //   console.log("User logedin");
  // }
  next();
};

// module.exports = saveRedirectUrl = (req, res, next) => {
//   if (req.session.redirectUrl) {
//     res.locals.redirectUrl = req.session.redirectUrl;
//   }
//   next();
// };

// module.exports.isOwner = async (req, res, next) => {
//   let { id } = req.params;
//   let listing = await Listing.findById(id);
//   if (listing.owner._id.equals(res.locals.curUser._id)) {
//     req.flash("success", "You don't have permission to edit this.");
//     req.redirect(`/listings/${id}`);
//   }
// };

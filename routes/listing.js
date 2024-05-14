const express = require("express");
const router = express.Router();

const Listing = require("../models/listings");
const islogedin = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudinaryConfig.js");
const upload = multer({ storage });
const { listingSchema } = require("../schema.js");

const ExpressError = require("../ExpressError.js");

const isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.curUser._id)) {
    req.flash("success", "You don't have permission to edit this.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

router.get("/new", islogedin, listingControllers.newListingRoute);
router.get("/:id/edit", islogedin, isOwner, listingControllers.editListing);
router
  .route("/")
  .get(listingControllers.index)
  .post(
    islogedin,
    validateListing,
    upload.single("listing[image]"),
    listingControllers.postListing
  );
// .post((req, res) => {
//   res.send(req.file);
// });

router
  .route("/:id")
  .get(listingControllers.showListing)
  .put(
    islogedin,
    isOwner,
    validateListing,
    upload.single("listing[image]"),
    listingControllers.updateListing
  )
  .delete(islogedin, isOwner, listingControllers.destroyListing);

//  INDEX ROUTE
// router.get("/", listingControllers.index);

// NEW ROUTE

// POST ROUTE
// router.post("/", islogedin, listingControllers.postListing);

// SHOW ROUTE
// router.get("/:id", listingControllers.showListing);

//EDIT ROUTE

// router.put("/:id", islogedin, isOwner, listingControllers.updateListing);

// router.delete("/:id", islogedin, isOwner, listingControllers.destroyListing);

// router.use((err, req, res, next) => {
//   let { status = 501, message = "Some error occured" } = err;
//   res.status(status).send(err.message);
// });
module.exports = router;

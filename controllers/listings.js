const Listing = require("../models/listings");

// INDEX ROUTE
module.exports.index = async (req, res) => {
  let allListings = await Listing.find();
  // console.log(allListings);
  res.render("listings/index.ejs", { allListings });
};
// NEW ROUTE

module.exports.newListingRoute = (req, res) => {
  res.render("listings/new.ejs");
};

// SHOW ROUTE
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  // console.log(id);
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  // console.log(listing);
  res.render("listings/show.ejs", { listing });
};
// POST ROUTE

module.exports.postListing = async (req, res) => {
  // let { tittle, description, image, price, location, country } = req.body;
  // console.log(title);
  try {
    let listing = await req.body.listing;
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(listing);
    const newListing = new Listing(listing);
    console.log(req.file);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.save();
    req.flash("success", "New listing added!");
    res.redirect("/listings");
  } catch (error) {
    res.send(error);
  }
};
// EDIT ROUTE
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};
// update route

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    listing.save();
    req.flash("success", "listing Updated!");
  }
  res.redirect(`/listings/${id}`);
};

// DESTROY ROUTE
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", "listing Deleted!");

  res.redirect("/listings");
};

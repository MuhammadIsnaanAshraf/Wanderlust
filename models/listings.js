const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const Review = require("./reviews.js");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
    // type: String,
    // default:
    //   "https://unsplash.com/photos/brown-https://unsplash.com/photos/brown-dried-leaves-on-ground-with-green-trees-ifjEbN18R44dried-leaves-on-ground-with-green-trees-ifjEbN18R44",
    // set: (v) =>
    //   v === ""
    //     ? "https://unsplash.com/photos/brown-dried-leaves-on-ground-withhttps://unsplash.com/photos/brown-dried-leaves-on-ground-with-green-trees-ifjEbN18R44-green-trees-ifjEbN18R44 "
    //     : v,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

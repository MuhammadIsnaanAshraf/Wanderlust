const mongoose = require("mongoose");
const listingData = require("./data.js");
const Listing = require("../models/listings");

main()
  .then((res) => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDb = async () => {
  await Listing.deleteMany({});
  listingData.data = listingData.data.map((obj) => ({
    ...obj,
    owner: "661bc3d381879bfb60d14565",
  }));
  await Listing.insertMany(listingData.data);
  console.log("Data has initialized");
};
initDb();

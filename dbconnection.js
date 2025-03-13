const mongoose = require("mongoose")
const DB1 = "DB1";

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/${DB1}`)
    console.log(
      "Connected To DATABASE "
    );
  } catch (error) {
    console.log(`error in connection DB ${error}`);
  }
};

module.exports = connectDB;
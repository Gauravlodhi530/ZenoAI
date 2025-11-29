const mongoose = require("mongoose");

async function connectedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongoose connected");
  } catch (error) {
    console.error("Mongoose connection error:", error.message);
  }
}

module.exports = connectedDB;

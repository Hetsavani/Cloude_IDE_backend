<<<<<<< HEAD
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // const conn = await mongoose.connect(process.env.MONGODB_URI, {
    const conn = await mongoose.connect(
      // process.env.MONGO_URI,
      "mongodb+srv://het07savani:het7102004@cluster0.qcip5sp.mongodb.net/ONLINE_IDE",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
=======
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // const conn = await mongoose.connect(process.env.MONGODB_URI, {
    const conn = await mongoose.connect(
      // process.env.MONGO_URI,
      "mongodb+srv://het07savani:het7102004@cluster0.qcip5sp.mongodb.net/ONLINE_IDE",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
>>>>>>> Het

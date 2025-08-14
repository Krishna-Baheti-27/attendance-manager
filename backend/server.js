import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB = process.env.MONGODB_URL;
const PORT = 3000;

async function startServer() {
  try {
    await mongoose.connect(DB);
    console.log(`DB connection successful`);
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}...`);
    });
  } catch (err) {
    console.log("Error connecting with DB");
  }
}

startServer();

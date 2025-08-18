import mongoose from "mongoose";

const DB = process.env.MONGODB_URL;
const PORT = 3000;

import app from "./app.js";

async function startServer() {
  try {
    await mongoose.connect(DB);
    console.log(`DB connection successful`);
    app.listen(PORT, () => {
      // only start the server if database connection is successful
      console.log(`Server listening on port ${PORT}...`);
    });
  } catch (err) {
    console.log("Error connecting with DB");
  }
}

startServer();

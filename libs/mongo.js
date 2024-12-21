import mongoose from "mongoose";

export default async function InitializeMongo() {
  try {
    console.log({ mongo_db_details: process.env.MONGO_DB_URI });

    // ConnectOptions for the MongoDB connection
    // Removed the 'authSource', as it may be different between DEV and PROD
    const dbConfig = {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // authSource: "admin",
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    };

    // Note: Sample string can be used or individual values. Here I have specified the string used in the ENV file
    // "mongodb+srv://adherelive:Q3xbZbp5f7O0AqR4@adherelive.aqaaqxe.mongodb.net/?retryWrites=true&w=majority",
    // const connectionString = `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`;
    const connectionString = process.env.MONGO_DB_URI;

    await mongoose
      .connect(connectionString, dbConfig)
      .then(() => console.log("Connected to MongoDB!", dbConfig))
      .catch((err) => console.error("Error connecting to MongoDB:", err));

    console.log(
      "Successfully Connected with the Mongo Database",
      connectionString
    );
  } catch (err) {
    console.log("Error connecting to MongoDB:", err);
  }
}

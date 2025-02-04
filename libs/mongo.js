import mongoose from "mongoose";
import { createLogger } from "./logger";

const logger = createLogger("SEQUELIZE QUERY MONGODB");

export default async function InitializeMongo() {
  try {
    console.debug({ mongo_db_details: process.config.mongo.db_uri });

    // ConnectOptions for the MongoDB connection
    // Removed the 'authSource', as it may be different between DEV and PROD
    // 'newUrlParser', 'useUnifiedTopology' are deprecated in mongo 4.4
    // 'poolSize' will need to revisit and see where it is used
    const dbConfig = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 5000,
      compressors: "zlib,snappy",
      // newUrlParser: true,
      // useUnifiedTopology: true,
      // authSource: "admin",
      // poolSize: 2,
    };

    // Note: Sample string can be used or individual values. Here I have specified the string used in the ENV file
    // "mongodb+srv://adherelive:Q3xbZbp5f7O0AqR4@adherelive.aqaaqxe.mongodb.net/?retryWrites=true&w=majority",
    // const connectionString = `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`;
    const connectionString = process.env.MONGO_DB_URI;

    await mongoose
      .connect(connectionString, dbConfig)
      .then(() => logger.debug("Connected to MongoDB! \n", dbConfig))
      .catch((err) => logger.error("Error connecting to MongoDB: \n", err));

    logger.debug("MongoDB Database string used is: ", connectionString);
  } catch (err) {
    logger.error("Error connecting to MongoDB: ", err);
  }
}

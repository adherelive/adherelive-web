const mongoose = require("mongoose");

mongoose.set("strictQuery", true); // Add this line to handle the deprecation warning

module.exports = async () => {
  try {
    console.log({ mongo_db_details: process.config.mongo });

    const dbConfig = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: "admin",
    };

    // "mongodb+srv://adherelive:Q3xbZbp5f7O0AqR4@adherelive.aqaaqxe.mongodb.net/?retryWrites=true&w=majority",
    //const connectionString = `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`;
    const connectionString = process.env.MONGO_DB_URI;

    mongoose
      .connect(connectionString, dbConfig)
      .then(() => console.log("Connected to MongoDB!"))
      .catch((err) => console.error("Error connecting to MongoDB:", err));

    console.log("Successfully Connected with mongo Database");
  } catch (ex) {
    console.log(ex);
  }
};

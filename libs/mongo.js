const mongoose = require("mongoose");

// Add this line to handle the deprecation warning
//mongoose.set("strictQuery", true);

module.exports = async () => {
  try {
    console.log({ mongo_db_details: process.config.mongo });

    const dbConfig = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: "admin",
    };

    // Note: Sample string can be used or individual values. Here I have specified the string used in the ENV file
    // "mongodb+srv://adherelive:Q3xbZbp5f7O0AqR4@adherelive.aqaaqxe.mongodb.net/?retryWrites=true&w=majority",
    // const connectionString = `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`;
    const connectionString = process.env.MONGO_DB_URI;

    await mongoose
      .connect(connectionString, dbConfig)
      .then(() => console.log("Connected to MongoDB!"))
      .catch((err) => console.error("Error connecting to MongoDB:", err));

    console.log("Successfully Connected with mongo Database");
  } catch (ex) {
    console.log(ex);
  }
};

const mongoose = require("mongoose");
module.exports = async () => {
  try {
    console.log({ 'mongo_db_details': process.config.mongo });
    await mongoose.connect(
      // "mongodb+srv://adherelive:Q3xbZbp5f7O0AqR4@adherelive.aqaaqxe.mongodb.net/?retryWrites=true&w=majority",
      process.config.mongo,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //  useFindAndModify: false,
        // useCreateIndex: true,
      }
    );
    console.log("Successfully Connected with mongo Database");
  } catch (ex) {
    console.log(ex);
  }
};

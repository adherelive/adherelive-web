const mongoose = require("mongoose");
mongoose.set('strictQuery', true); // Add this line to handle the deprecation warning

module.exports = async () => {
  try {
    console.log({ 'mongo_db_details': process.config.mongo });
        const dbConfig = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            authSource: 'admin'
        };

        const connectionString = `mongodb://mongouser:password@mongodb:27017/adhere`;

        await mongoose.connect(connectionString, dbConfig)
            .then(() => console.log('Connected to MongoDB!'))
            .catch((err) => console.error('Error connecting to MongoDB:', err));


	//await mongoose.connect(
        // "mongodb+srv://adherelive:Q3xbZbp5f7O0AqR4@adherelive.aqaaqxe.mongodb.net/?retryWrites=true&w=majority",
      //process.config.mongo,
      //{
        //useNewUrlParser: true,
        //useUnifiedTopology: true,
        //  useFindAndModify: false,
        // useCreateIndex: true,
      //}
    //);
    console.log("Successfully Connected with mongo Database");
  } catch (ex) {
    console.log(ex);
  }
};

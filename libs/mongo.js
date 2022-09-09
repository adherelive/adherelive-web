const mongoose = require("mongoose");
module.exports = async () => {
  try {
    await mongoose.connect(
      // "mongodb+srv://adherelive:<password>@adherelive.aqaaqxe.mongodb.net/?retryWrites=true&w=majority",
      "mongodb://mongo/adhere",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
        // useCreateIndex: true,
      }
    );
    console.log("Successfully Connected with mongo Database");
  } catch (ex) {
    console.log(ex);
  }
};

const mongoose = require("mongoose");
module.exports = async () => {
  try {
    await mongoose.connect("mongodb://mongo/adhere", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
      // useCreateIndex: true,
    });
    console.log("Successfully Connected with mongo Database");
  } catch (ex) {
    console.log(ex);
  }
};
